from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import Optional, List
from datetime import datetime, timezone
import os
import uuid
from motor.motor_asyncio import AsyncIOMotorClient

from models.cms import (
    ServiceCreate, ServiceResponse, ServiceUpdate, ServiceField,
    CountryCreate, CountryResponse, CountryUpdate,
    ContentBlock, ContentUpdate, BrandingSettings
)
from models.user import Permission, UserInDB
from routes.auth import get_current_user, require_permission, check_permission

router = APIRouter(prefix="/cms", tags=["CMS"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

services_collection = db.services
countries_collection = db.countries
content_collection = db.content
settings_collection = db.settings

UPLOAD_DIR = "/app/uploads"


# ============ Services ============

@router.get("/services", response_model=List[ServiceResponse])
async def list_services(active_only: bool = False):
    """List all services (public)"""
    query = {"is_active": True} if active_only else {}
    cursor = services_collection.find(query, {"_id": 0}).sort("order", 1)
    services = await cursor.to_list(length=100)
    return [ServiceResponse(**s) for s in services]


@router.get("/services/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: str):
    """Get service by ID"""
    service = await services_collection.find_one({"service_id": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceResponse(**service)


@router.post("/services", response_model=ServiceResponse)
async def create_service(
    service: ServiceCreate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_SERVICES))
):
    """Create new service"""
    now = datetime.now(timezone.utc).isoformat()
    service_doc = service.model_dump()
    service_doc["created_at"] = now
    service_doc["updated_at"] = now
    
    await services_collection.insert_one(service_doc)
    return ServiceResponse(**service_doc)


@router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: str,
    update: ServiceUpdate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_SERVICES))
):
    """Update service"""
    update_doc = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    for field, value in update.model_dump(exclude_unset=True).items():
        if value is not None:
            update_doc[field] = value
    
    result = await services_collection.find_one_and_update(
        {"service_id": service_id},
        {"$set": update_doc},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return ServiceResponse(**result)


@router.delete("/services/{service_id}")
async def delete_service(
    service_id: str,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_SERVICES))
):
    """Delete service"""
    result = await services_collection.delete_one({"service_id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}


# ============ Countries (for international transfers) ============

@router.get("/countries", response_model=List[CountryResponse])
async def list_countries(active_only: bool = False):
    """List all countries for transfers"""
    query = {"is_active": True} if active_only else {}
    cursor = countries_collection.find(query, {"_id": 0})
    countries = await cursor.to_list(length=200)
    return [CountryResponse(**c) for c in countries]


@router.get("/countries/{country_code}", response_model=CountryResponse)
async def get_country(country_code: str):
    """Get country by code"""
    country = await countries_collection.find_one({"country_code": country_code.upper()}, {"_id": 0})
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return CountryResponse(**country)


@router.post("/countries", response_model=CountryResponse)
async def create_country(
    country: CountryCreate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_COUNTRIES))
):
    """Create new country config"""
    now = datetime.now(timezone.utc).isoformat()
    country_doc = country.model_dump()
    country_doc["country_code"] = country_doc["country_code"].upper()
    country_doc["created_at"] = now
    country_doc["updated_at"] = now
    
    # Check if exists
    existing = await countries_collection.find_one({"country_code": country_doc["country_code"]})
    if existing:
        raise HTTPException(status_code=400, detail="Country already exists")
    
    await countries_collection.insert_one(country_doc)
    return CountryResponse(**country_doc)


@router.put("/countries/{country_code}", response_model=CountryResponse)
async def update_country(
    country_code: str,
    update: CountryUpdate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_COUNTRIES))
):
    """Update country config"""
    update_doc = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    for field, value in update.model_dump(exclude_unset=True).items():
        if value is not None:
            update_doc[field] = value
    
    result = await countries_collection.find_one_and_update(
        {"country_code": country_code.upper()},
        {"$set": update_doc},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Country not found")
    
    return CountryResponse(**result)


@router.delete("/countries/{country_code}")
async def delete_country(
    country_code: str,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_COUNTRIES))
):
    """Delete country"""
    result = await countries_collection.delete_one({"country_code": country_code.upper()})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Country not found")
    return {"message": "Country deleted"}


# ============ Content Blocks ============

@router.get("/content")
async def list_content(page: Optional[str] = None):
    """List all content blocks"""
    query = {"page": page} if page else {}
    cursor = content_collection.find(query, {"_id": 0}).sort("order", 1)
    content = await cursor.to_list(length=500)
    return content


@router.get("/content/{block_id}")
async def get_content(block_id: str):
    """Get content block"""
    block = await content_collection.find_one({"block_id": block_id}, {"_id": 0})
    if not block:
        raise HTTPException(status_code=404, detail="Content block not found")
    return block


@router.put("/content/{block_id}")
async def update_content(
    block_id: str,
    update: ContentUpdate,
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_CONTENT))
):
    """Update content block"""
    update_doc = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    for field, value in update.model_dump(exclude_unset=True).items():
        if value is not None:
            update_doc[field] = value
    
    result = await content_collection.find_one_and_update(
        {"block_id": block_id},
        {"$set": update_doc},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        # Create new block if not exists
        block_doc = {
            "block_id": block_id,
            "page": block_id.split("_")[0],
            "section": block_id,
            **update_doc
        }
        await content_collection.insert_one(block_doc)
        return block_doc
    
    return result


# ============ Branding ============

@router.get("/branding", response_model=BrandingSettings)
async def get_branding():
    """Get branding settings"""
    settings = await settings_collection.find_one({"type": "branding"}, {"_id": 0})
    if not settings:
        return BrandingSettings()
    return BrandingSettings(**settings)


@router.put("/branding", response_model=BrandingSettings)
async def update_branding(
    branding: BrandingSettings,
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_BRANDING))
):
    """Update branding settings"""
    settings_doc = branding.model_dump()
    settings_doc["type"] = "branding"
    settings_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await settings_collection.update_one(
        {"type": "branding"},
        {"$set": settings_doc},
        upsert=True
    )
    
    return branding


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_BRANDING))
):
    """Upload file (logo, images, etc.)"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Generate filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    
    return {"url": f"/uploads/{filename}", "filename": filename}


# ============ Terms and Conditions ============

@router.get("/terms")
async def get_terms():
    """Get terms and conditions content (public)"""
    terms = await settings_collection.find_one({"type": "terms"}, {"_id": 0})
    if not terms:
        return None
    return terms.get("content", {})


@router.put("/terms")
async def update_terms(
    content: dict,
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_CONTENT))
):
    """Update terms and conditions"""
    settings_doc = {
        "type": "terms",
        "content": content,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": current_user.name
    }
    
    await settings_collection.update_one(
        {"type": "terms"},
        {"$set": settings_doc},
        upsert=True
    )
    
    return {"message": "Terms updated", "content": content}


# ============ Contact Information ============

@router.get("/contact")
async def get_contact():
    """Get contact information (public)"""
    contact = await settings_collection.find_one({"type": "contact"}, {"_id": 0})
    if not contact:
        return None
    return contact.get("content", {})


@router.put("/contact")
async def update_contact(
    content: dict,
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_CONTENT))
):
    """Update contact information"""
    settings_doc = {
        "type": "contact",
        "content": content,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": current_user.name
    }
    
    await settings_collection.update_one(
        {"type": "contact"},
        {"$set": settings_doc},
        upsert=True
    )
    
    return {"message": "Contact info updated", "content": content}


# ============ Initialize Default Data ============

async def init_default_services():
    """Initialize default services if not exist"""
    count = await services_collection.count_documents({})
    if count == 0:
        default_services = [
            {
                "service_id": "traveler_booking",
                "name_ar": "حجز الدولار للمسافرين",
                "name_en": "Traveler USD Booking",
                "description_ar": "حجز الدولار الأمريكي للسفر",
                "description_en": "Book US dollars for travel",
                "icon": "Plane",
                "color": "#3B82F6",
                "is_active": True,
                "order": 1,
                "route": "/traveler-booking",
                "service_type": "traveler",
                "fields": [],
                "settings": {"exchange_rate": 1500},
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "service_id": "local_transfer",
                "name_ar": "تحويل محلي",
                "name_en": "Local Transfer",
                "description_ar": "تحويل أموال داخل العراق",
                "description_en": "Money transfer within Iraq",
                "icon": "MapPin",
                "color": "#10B981",
                "is_active": True,
                "order": 2,
                "route": "/transfers/local",
                "service_type": "local",
                "fields": [],
                "settings": {"fee_percentage": 2},
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "service_id": "international_transfer",
                "name_ar": "تحويل دولي",
                "name_en": "International Transfer",
                "description_ar": "تحويل أموال دولي",
                "description_en": "International money transfer",
                "icon": "Globe",
                "color": "#8B5CF6",
                "is_active": True,
                "order": 3,
                "route": "/transfers/international",
                "service_type": "international",
                "fields": [],
                "settings": {},
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await services_collection.insert_many(default_services)
        print("Default services created")


async def init_default_countries():
    """Initialize default countries for international transfers"""
    count = await countries_collection.count_documents({})
    if count == 0:
        default_countries = [
            {
                "country_code": "TR",
                "name_ar": "تركيا",
                "name_en": "Turkey",
                "flag": "🇹🇷",
                "currency": "TRY",
                "is_active": True,
                "transfer_methods": [
                    {"method_id": "papara", "name_ar": "باباره", "name_en": "Papara", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 2},
                    {"method_id": "eft", "name_ar": "EFT", "name_en": "EFT", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 2.5},
                    {"method_id": "bank", "name_ar": "تحويل بنكي", "name_en": "Bank Transfer", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 3}
                ],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "country_code": "EG",
                "name_ar": "مصر",
                "name_en": "Egypt",
                "flag": "🇪🇬",
                "currency": "EGP",
                "is_active": True,
                "transfer_methods": [
                    {"method_id": "vodafone_cash", "name_ar": "فودافون كاش", "name_en": "Vodafone Cash", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 1.5},
                    {"method_id": "instapay", "name_ar": "إنستاباي", "name_en": "InstaPay", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 2},
                    {"method_id": "bank", "name_ar": "تحويل بنكي", "name_en": "Bank Transfer", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 3}
                ],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "country_code": "JO",
                "name_ar": "الأردن",
                "name_en": "Jordan",
                "flag": "🇯🇴",
                "currency": "JOD",
                "is_active": True,
                "transfer_methods": [
                    {"method_id": "cliq", "name_ar": "كليك", "name_en": "CliQ", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 2},
                    {"method_id": "bank", "name_ar": "تحويل بنكي", "name_en": "Bank Transfer", "is_active": True, "fields": [], "fee_type": "percentage", "fee_value": 3}
                ],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await countries_collection.insert_many(default_countries)
        print("Default countries created")
