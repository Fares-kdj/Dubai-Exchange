from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List, Dict
from datetime import datetime, timezone
from pydantic import BaseModel
import os
import httpx

from models.user import Permission, UserInDB
from routes.auth import get_current_user, require_permission

router = APIRouter(prefix="/rates", tags=["Exchange Rates"])

from database import db
rates_collection = db.exchange_rates
settings_collection = db.settings


class ExchangeRate(BaseModel):
    currency_code: str  # USD, EUR, TRY, etc.
    currency_name_ar: str
    currency_name_en: str
    flag: str  # Emoji
    buy_rate: float  # سعر الشراء (IQD per 1 unit)
    sell_rate: float  # سعر البيع
    is_active: bool = True
    order: int = 0


class RateUpdate(BaseModel):
    buy_rate: Optional[float] = None
    sell_rate: Optional[float] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class RateResponse(ExchangeRate):
    updated_at: str
    updated_by: Optional[str] = None


class BulkRateUpdate(BaseModel):
    rates: List[Dict]  # [{currency_code, buy_rate, sell_rate}, ...]


@router.get("", response_model=List[RateResponse])
async def get_rates(active_only: bool = True):
    """Get all exchange rates (public)"""
    query = {"is_active": True} if active_only else {}
    cursor = rates_collection.find(query, {"_id": 0}).sort("order", 1)
    rates = await cursor.to_list(length=100)
    return [RateResponse(**r) for r in rates]


@router.get("/{currency_code}", response_model=RateResponse)
async def get_rate(currency_code: str):
    """Get single currency rate"""
    rate = await rates_collection.find_one(
        {"currency_code": currency_code.upper()},
        {"_id": 0}
    )
    if not rate:
        raise HTTPException(status_code=404, detail="Currency not found")
    return RateResponse(**rate)


@router.post("", response_model=RateResponse)
async def create_rate(
    rate: ExchangeRate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_RATES))
):
    """Create new exchange rate"""
    # Check if exists
    existing = await rates_collection.find_one({"currency_code": rate.currency_code.upper()})
    if existing:
        raise HTTPException(status_code=400, detail="Currency already exists")
    
    rate_doc = rate.model_dump()
    rate_doc["currency_code"] = rate_doc["currency_code"].upper()
    rate_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    rate_doc["updated_by"] = current_user.name
    
    await rates_collection.insert_one(rate_doc)
    return RateResponse(**rate_doc)


@router.put("/bulk/update")
async def bulk_update_rates(
    data: BulkRateUpdate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_RATES))
):
    """Bulk update multiple rates at once"""
    updated = 0
    now = datetime.now(timezone.utc).isoformat()
    
    for rate_data in data.rates:
        code = rate_data.get("currency_code", "").upper()
        if not code:
            continue
        
        update_doc = {
            "updated_at": now,
            "updated_by": current_user.name
        }
        
        if "buy_rate" in rate_data:
            update_doc["buy_rate"] = rate_data["buy_rate"]
        if "sell_rate" in rate_data:
            update_doc["sell_rate"] = rate_data["sell_rate"]
        
        result = await rates_collection.update_one(
            {"currency_code": code},
            {"$set": update_doc}
        )
        if result.modified_count > 0:
            updated += 1
    
    return {"message": f"Updated {updated} rates", "updated": updated}


@router.put("/{currency_code}", response_model=RateResponse)
async def update_rate(
    currency_code: str,
    update: RateUpdate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_RATES))
):
    """Update exchange rate"""
    update_doc = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": current_user.name
    }
    
    for field, value in update.model_dump(exclude_unset=True).items():
        if value is not None:
            update_doc[field] = value
    
    result = await rates_collection.find_one_and_update(
        {"currency_code": currency_code.upper()},
        {"$set": update_doc},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Currency not found")
    
    return RateResponse(**result)


@router.delete("/{currency_code}")
async def delete_rate(
    currency_code: str,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_RATES))
):
    """Delete exchange rate"""
    result = await rates_collection.delete_one({"currency_code": currency_code.upper()})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Currency not found")
    return {"message": "Rate deleted"}


# Rate Mode Settings
class RateModeSettings(BaseModel):
    mode: str = "manual"  # "manual" or "auto"
    api_source: str = "exchangerate-api"  # API source for auto mode
    update_interval_minutes: int = 60


@router.get("/settings/mode")
async def get_rate_mode():
    """Get current rate mode settings (public)"""
    settings = await settings_collection.find_one(
        {"type": "rate_mode"},
        {"_id": 0}
    )
    if not settings:
        return {"mode": "manual", "api_source": "exchangerate-api", "update_interval_minutes": 60}
    return settings


@router.put("/settings/mode")
async def update_rate_mode(
    settings: RateModeSettings,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_RATES))
):
    """Update rate mode settings (admin only)"""
    settings_doc = settings.model_dump()
    settings_doc["type"] = "rate_mode"
    settings_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    settings_doc["updated_by"] = current_user.name
    
    await settings_collection.update_one(
        {"type": "rate_mode"},
        {"$set": settings_doc},
        upsert=True
    )
    return {"message": "Rate mode updated", "settings": settings_doc}


@router.get("/live/fetch")
async def fetch_live_rates():
    """Fetch live exchange rates from API (public - uses cached IQD rates)"""
    try:
        # Get current mode
        mode_settings = await settings_collection.find_one({"type": "rate_mode"}, {"_id": 0})
        mode = mode_settings.get("mode", "manual") if mode_settings else "manual"
        
        if mode == "manual":
            # Return stored rates
            cursor = rates_collection.find({"is_active": True}, {"_id": 0}).sort("order", 1)
            rates = await cursor.to_list(length=100)
            return {"source": "manual", "rates": rates}
        
        # Auto mode - fetch from free API
        # Using exchangerate-api.com free tier (IQD base)
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Fetch USD-based rates and convert to IQD
            response = await client.get("https://api.exchangerate-api.com/v4/latest/USD")
            if response.status_code == 200:
                data = response.json()
                usd_rates = data.get("rates", {})
                
                # IQD rate per 1 USD (approximate)
                iqd_per_usd = usd_rates.get("IQD", 1460)
                
                # Calculate rates for common currencies
                live_rates = []
                currency_map = {
                    "USD": {"ar": "دولار أمريكي", "en": "US Dollar", "flag": "🇺🇸"},
                    "EUR": {"ar": "يورو", "en": "Euro", "flag": "🇪🇺"},
                    "GBP": {"ar": "جنيه إسترليني", "en": "British Pound", "flag": "🇬🇧"},
                    "TRY": {"ar": "ليرة تركية", "en": "Turkish Lira", "flag": "🇹🇷"},
                    "AED": {"ar": "درهم إماراتي", "en": "UAE Dirham", "flag": "🇦🇪"},
                    "SAR": {"ar": "ريال سعودي", "en": "Saudi Riyal", "flag": "🇸🇦"},
                    "JOD": {"ar": "دينار أردني", "en": "Jordanian Dinar", "flag": "🇯🇴"},
                    "EGP": {"ar": "جنيه مصري", "en": "Egyptian Pound", "flag": "🇪🇬"},
                    "KWD": {"ar": "دينار كويتي", "en": "Kuwaiti Dinar", "flag": "🇰🇼"},
                    "IRR": {"ar": "ريال إيراني", "en": "Iranian Rial", "flag": "🇮🇷"}
                }
                
                for code, info in currency_map.items():
                    if code in usd_rates:
                        # Calculate IQD per 1 unit of currency
                        rate_to_usd = usd_rates[code]
                        iqd_rate = round(iqd_per_usd / rate_to_usd, 2)
                        
                        live_rates.append({
                            "currency_code": code,
                            "currency_name_ar": info["ar"],
                            "currency_name_en": info["en"],
                            "flag": info["flag"],
                            "buy_rate": round(iqd_rate * 0.995, 2),  # 0.5% spread
                            "sell_rate": round(iqd_rate * 1.005, 2),
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        })
                    elif code == "USD":
                        live_rates.append({
                            "currency_code": "USD",
                            "currency_name_ar": info["ar"],
                            "currency_name_en": info["en"],
                            "flag": info["flag"],
                            "buy_rate": round(iqd_per_usd * 0.995, 2),
                            "sell_rate": round(iqd_per_usd * 1.005, 2),
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        })
                
                return {"source": "live", "rates": live_rates, "timestamp": data.get("time_last_updated")}
        
        # Fallback to stored rates
        cursor = rates_collection.find({"is_active": True}, {"_id": 0}).sort("order", 1)
        rates = await cursor.to_list(length=100)
        return {"source": "fallback", "rates": rates}
        
    except Exception as e:
        # Return stored rates on error
        cursor = rates_collection.find({"is_active": True}, {"_id": 0}).sort("order", 1)
        rates = await cursor.to_list(length=100)
        return {"source": "fallback", "error": str(e), "rates": rates}


@router.post("/live/sync")
async def sync_live_rates(
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_RATES))
):
    """Sync live rates to database (admin only)"""
    try:
        live_data = await fetch_live_rates()
        if live_data.get("source") != "live":
            return {"message": "Could not fetch live rates", "synced": 0}
        
        synced = 0
        now = datetime.now(timezone.utc).isoformat()
        
        for rate in live_data.get("rates", []):
            await rates_collection.update_one(
                {"currency_code": rate["currency_code"]},
                {"$set": {
                    **rate,
                    "updated_at": now,
                    "updated_by": "Live Sync",
                    "is_active": True
                }},
                upsert=True
            )
            synced += 1
        
        return {"message": f"Synced {synced} rates from live API", "synced": synced}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


# Initialize default rates
async def init_default_rates():
    """Initialize default exchange rates"""
    count = await rates_collection.count_documents({})
    if count == 0:
        default_rates = [
            {
                "currency_code": "USD",
                "currency_name_ar": "دولار أمريكي",
                "currency_name_en": "US Dollar",
                "flag": "🇺🇸",
                "buy_rate": 1460,
                "sell_rate": 1470,
                "is_active": True,
                "order": 1,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            },
            {
                "currency_code": "EUR",
                "currency_name_ar": "يورو",
                "currency_name_en": "Euro",
                "flag": "🇪🇺",
                "buy_rate": 1580,
                "sell_rate": 1595,
                "is_active": True,
                "order": 2,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            },
            {
                "currency_code": "GBP",
                "currency_name_ar": "جنيه إسترليني",
                "currency_name_en": "British Pound",
                "flag": "🇬🇧",
                "buy_rate": 1840,
                "sell_rate": 1860,
                "is_active": True,
                "order": 3,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            },
            {
                "currency_code": "TRY",
                "currency_name_ar": "ليرة تركية",
                "currency_name_en": "Turkish Lira",
                "flag": "🇹🇷",
                "buy_rate": 42,
                "sell_rate": 44,
                "is_active": True,
                "order": 4,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            },
            {
                "currency_code": "AED",
                "currency_name_ar": "درهم إماراتي",
                "currency_name_en": "UAE Dirham",
                "flag": "🇦🇪",
                "buy_rate": 395,
                "sell_rate": 400,
                "is_active": True,
                "order": 5,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            },
            {
                "currency_code": "SAR",
                "currency_name_ar": "ريال سعودي",
                "currency_name_en": "Saudi Riyal",
                "flag": "🇸🇦",
                "buy_rate": 385,
                "sell_rate": 390,
                "is_active": True,
                "order": 6,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            },
            {
                "currency_code": "JOD",
                "currency_name_ar": "دينار أردني",
                "currency_name_en": "Jordanian Dinar",
                "flag": "🇯🇴",
                "buy_rate": 2050,
                "sell_rate": 2070,
                "is_active": True,
                "order": 7,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            },
            {
                "currency_code": "EGP",
                "currency_name_ar": "جنيه مصري",
                "currency_name_en": "Egyptian Pound",
                "flag": "🇪🇬",
                "buy_rate": 29,
                "sell_rate": 31,
                "is_active": True,
                "order": 8,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "updated_by": "System"
            }
        ]
        await rates_collection.insert_many(default_rates)
        print("Default exchange rates created")
