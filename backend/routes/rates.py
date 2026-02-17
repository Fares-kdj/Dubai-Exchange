from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List, Dict
from datetime import datetime, timezone
from pydantic import BaseModel
import os
import httpx
from motor.motor_asyncio import AsyncIOMotorClient

from models.user import Permission, UserInDB
from routes.auth import get_current_user, require_permission

router = APIRouter(prefix="/rates", tags=["Exchange Rates"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]
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
