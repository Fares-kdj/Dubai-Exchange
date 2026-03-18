from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
settings_collection = db.settings
orders_collection = db.orders

# Create upload directory
UPLOAD_DIR = str(ROOT_DIR / "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Import route modules and their init functions
from routes.orders import router as orders_router
from routes.auth import router as auth_router, init_developer_account
from routes.cms import router as cms_router, init_default_services, init_default_countries, init_predefined_methods
from routes.rates import router as rates_router, init_default_rates, ensure_usd_locked
from routes.pdf import router as pdf_router
from routes.blocklist import router as blocklist_router
from routes.stamps import router as stamps_router, init_default_stamps
from services.sms_service import sms_service

# ===== LIFESPAN =====

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle"""
    try:
        await client.admin.command('ping')
        logger.info("MongoDB connection successful")
        await init_developer_account()
        await init_default_services()
        await init_default_countries()
        await init_predefined_methods()
        await init_default_rates()
        await ensure_usd_locked()
        await init_default_stamps()
        await sms_service.sync_whatsapp(db)
        logger.info("Default data initialized successfully")
    except Exception as e:
        logger.error(f"Startup init error: {e}")
    yield
    # Shutdown
    client.close()

# Create the main app without a prefix
app = FastAPI(title="Dubai International Exchange API", lifespan=lifespan)

# ===== NO-CACHE MIDDLEWARE (prevents Cloudflare from caching API responses) =====
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as StarletteRequest

class NoCacheAPIMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: StarletteRequest, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Surrogate-Control"] = "no-store"
        return response

app.add_middleware(NoCacheAPIMiddleware)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

api_router.include_router(orders_router)
api_router.include_router(auth_router)
api_router.include_router(cms_router)
api_router.include_router(rates_router)
api_router.include_router(pdf_router)
api_router.include_router(blocklist_router)
api_router.include_router(stamps_router)


# ===== MODELS =====

class CompanySettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    company_name_en: str = "Dubai International for Exchange"
    company_name_ar: str = "شركة دبي العالمية للصرافة"
    company_name_ku: str = "دوبەی نێودەوڵەتی بۆ گۆڕینەوە"
    phone: str = "+964 XXX XXX XXXX"
    whatsapp: str = "+964 XXX XXX XXXX"
    email: str = "info@dubai-exchange.com"
    address_ar: str = "بغداد، العراق"
    address_en: str = "Baghdad, Iraq"
    address_ku: str = "بەغدا، عێراق"
    facebook: Optional[str] = "#"
    twitter: Optional[str] = "#"
    instagram: Optional[str] = "#"
    linkedin: Optional[str] = "#"

class CurrencyRate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    from_currency: str
    to_currency: str
    rate: float
    last_updated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ExchangeRatesSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    mode: str = "manual"  # "auto" or "manual"
    rates: List[CurrencyRate] = []


class ConvertRequest(BaseModel):
    from_currency: str
    to_currency: str
    amount: float


# ===== SETTINGS ENDPOINTS =====

@api_router.get("/")
async def root():
    return {"message": "Dubai International Exchange API"}

@api_router.get("/settings/company", response_model=CompanySettings)
async def get_company_settings():
    """Get company contact and branding information"""
    settings = await settings_collection.find_one({"type": "company"}, {"_id": 0})
    if not settings:
        # Return default settings
        default_settings = CompanySettings()
        return default_settings
    return CompanySettings(**settings)

@api_router.put("/settings/company", response_model=CompanySettings)
async def update_company_settings(settings: CompanySettings):
    """Update company settings (Admin only - will add auth later)"""
    settings_dict = settings.model_dump()
    settings_dict["type"] = "company"
    
    await settings_collection.update_one(
        {"type": "company"},
        {"$set": settings_dict},
        upsert=True
    )
    # Sync with SMS service
    from database import db as database_db
    await sms_service.sync_whatsapp(database_db)
    
    return settings

@api_router.get("/settings/exchange-rates", response_model=ExchangeRatesSettings)
async def get_exchange_rates():
    """Get exchange rates settings"""
    settings = await settings_collection.find_one({"type": "exchange_rates"}, {"_id": 0})
    if not settings:
        # Return default rates
        default_rates = ExchangeRatesSettings(
            mode="manual",
            rates=[
                CurrencyRate(from_currency="USD", to_currency="IQD", rate=1500.0),
                CurrencyRate(from_currency="EUR", to_currency="IQD", rate=1650.0),
                CurrencyRate(from_currency="GBP", to_currency="IQD", rate=1900.0),
            ]
        )
        return default_rates
    return ExchangeRatesSettings(**settings)

@api_router.put("/settings/exchange-rates", response_model=ExchangeRatesSettings)
async def update_exchange_rates(settings: ExchangeRatesSettings):
    """Update exchange rates (Admin only)"""
    settings_dict = settings.model_dump()
    settings_dict["type"] = "exchange_rates"
    
    await settings_collection.update_one(
        {"type": "exchange_rates"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings

@api_router.post("/convert")
async def convert_currency(request: ConvertRequest):
    """Convert currency based on current rates"""
    from_currency = request.from_currency
    to_currency = request.to_currency
    amount = request.amount

    rates_settings = await get_exchange_rates()
    
    # Find the rate
    rate_obj = None
    for rate in rates_settings.rates:
        if rate.from_currency == from_currency and rate.to_currency == to_currency:
            rate_obj = rate
            break
    
    if not rate_obj:
        # Try reverse rate
        for rate in rates_settings.rates:
            if rate.from_currency == to_currency and rate.to_currency == from_currency:
                rate_obj = CurrencyRate(
                    from_currency=from_currency,
                    to_currency=to_currency,
                    rate=1/rate.rate,
                    last_updated=rate.last_updated
                )
                break
    
    if not rate_obj:
        raise HTTPException(status_code=404, detail="Exchange rate not found")
    
    result = amount * rate_obj.rate
    
    return {
        "from_currency": from_currency,
        "to_currency": to_currency,
        "amount": amount,
        "result": round(result, 2),
        "rate": rate_obj.rate,
        "last_updated": rate_obj.last_updated
    }


# Include the router in the main app
app.include_router(api_router)

# Mount uploads directory for serving files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

