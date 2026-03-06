from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import Optional, List
from datetime import datetime, timezone
import os
import uuid
from pathlib import Path

from models.cms import (
    ServiceCreate, ServiceResponse, ServiceUpdate, ServiceField,
    CountryCreate, CountryResponse, CountryUpdate,
    ContentBlock, ContentUpdate, BrandingSettings,
    PredefinedMethod, PredefinedMethodUpdate, WesternUnionSettings, MoneyGramSettings
)
from models.user import Permission, UserInDB
from routes.auth import get_current_user, require_permission, check_permission

router = APIRouter(prefix="/cms", tags=["CMS"])

from database import db
services_collection = db.services
countries_collection = db.countries
content_collection = db.content
settings_collection = db.settings
predefined_methods_collection = db.predefined_methods

UPLOAD_DIR = str(Path(__file__).parent.parent / "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


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
    service_doc.pop("_id", None)
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
    country_doc.pop("_id", None)
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


# ============ Predefined Methods (Templates) ============

@router.get("/predefined-methods", response_model=List[PredefinedMethod])
async def list_predefined_methods():
    """List all predefined method templates"""
    cursor = predefined_methods_collection.find({}, {"_id": 0})
    methods = await cursor.to_list(length=100)
    return [PredefinedMethod(**m) for m in methods]


@router.post("/predefined-methods", response_model=PredefinedMethod)
async def create_predefined_method(
    method: PredefinedMethod,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_COUNTRIES))
):
    """Create new predefined method template"""
    existing = await predefined_methods_collection.find_one({"method_id": method.method_id})
    if existing:
        raise HTTPException(status_code=400, detail="Method template ID already exists")
    
    method_doc = method.model_dump()
    await predefined_methods_collection.insert_one(method_doc)
    method_doc.pop("_id", None)
    return PredefinedMethod(**method_doc)


@router.put("/predefined-methods/{method_id}", response_model=PredefinedMethod)
async def update_predefined_method(
    method_id: str,
    update: PredefinedMethodUpdate,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_COUNTRIES))
):
    """Update predefined method template"""
    update_doc = update.model_dump(exclude_unset=True)
    
    result = await predefined_methods_collection.find_one_and_update(
        {"method_id": method_id},
        {"$set": update_doc},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Method template not found")
    
    return PredefinedMethod(**result)


@router.delete("/predefined-methods/{method_id}")
async def delete_predefined_method(
    method_id: str,
    current_user: UserInDB = Depends(require_permission(Permission.MANAGE_COUNTRIES))
):
    """Delete predefined method template"""
    result = await predefined_methods_collection.delete_one({"method_id": method_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Method template not found")
    return {"message": "Method template deleted"}


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
    settings.pop("type", None)
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
    # Validate by file extension (more reliable than content_type which varies by browser)
    allowed_extensions = {"jpg", "jpeg", "png", "gif", "svg", "webp", "ico"}
    allowed_content_types = [
        "image/jpeg", "image/jpg", "image/png", "image/gif",
        "image/svg+xml", "image/webp", "image/x-icon",
        "image/vnd.microsoft.icon", "application/octet-stream",
        "image/x-png", "image/apng", "image/pjpeg", "image/bmp", "image/x-windows-bmp",
    ]

    # Get extension from filename
    ext = ""
    if file.filename and "." in file.filename:
        ext = file.filename.rsplit(".", 1)[-1].lower()

    # Validate: must pass either extension check or content_type check
    ext_ok = ext in allowed_extensions
    ctype_ok = file.content_type in allowed_content_types if file.content_type else False

    if not ext_ok and not ctype_ok:
        raise HTTPException(
            status_code=400,
            detail=f"نوع الملف غير مدعوم ({file.content_type if file.content_type else 'unknown'}). الأنواع المدعومة: PNG, JPG, GIF, SVG, WebP, ICO"
        )

    # Use extension from filename or fall back to content_type hint
    if not ext:
        content_type_map = {
            "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png",
            "image/gif": "gif", "image/svg+xml": "svg", "image/webp": "webp",
            "image/x-png": "png",
        }
        ext = content_type_map.get(file.content_type, "png")

    # Generate unique filename
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
        return {
            "ar": {"title": "الشروط والأحكام", "sections": []},
            "en": {"title": "Terms and Conditions", "sections": []},
            "ku": {"title": "مەرج و رێساکان", "sections": []}
        }
    return terms.get("content", {
        "ar": {"title": "الشروط والأحكام", "sections": []},
        "en": {"title": "Terms and Conditions", "sections": []},
        "ku": {"title": "مەرج و رێساکان", "sections": []}
    })


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


# ============ Traveler Booking Terms ============

@router.get("/traveler-terms")
async def get_traveler_terms():
    """Get terms and conditions content for traveler booking (public)"""
    terms = await settings_collection.find_one({"type": "traveler_terms"}, {"_id": 0})
    if not terms:
        return {
            "ar": {"title": "شروط حجز المسافرين", "sections": []},
            "en": {"title": "Traveler Booking Terms", "sections": []},
            "ku": {"title": "مەرجەکانی حجزکردنی گەشتیار", "sections": []}
        }
    return terms.get("content", {
        "ar": {"title": "شروط حجز المسافرين", "sections": []},
        "en": {"title": "Traveler Booking Terms", "sections": []},
        "ku": {"title": "مەرجەکانی حجزکردنی گەشتیار", "sections": []}
    })


@router.put("/traveler-terms")
async def update_traveler_terms(
    content: dict,
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_CONTENT))
):
    """Update terms and conditions for traveler booking"""
    settings_doc = {
        "type": "traveler_terms",
        "content": content,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": current_user.name
    }
    
    await settings_collection.update_one(
        {"type": "traveler_terms"},
        {"$set": settings_doc},
        upsert=True
    )
    
    return {"message": "Traveler terms updated", "content": content}


# ============ Contact Information ============

@router.get("/contact")
async def get_contact():
    """Get contact information (public)"""
    contact = await settings_collection.find_one({"type": "contact"}, {"_id": 0})
    if not contact:
        return {
            "ar": {"address": "", "phone": "", "email": "", "working_hours": ""},
            "en": {"address": "", "phone": "", "email": "", "working_hours": ""},
            "ku": {"address": "", "phone": "", "email": "", "working_hours": ""}
        }
    return contact.get("content", {
        "ar": {"address": "", "phone": "", "email": "", "working_hours": ""},
        "en": {"address": "", "phone": "", "email": "", "working_hours": ""},
        "ku": {"address": "", "phone": "", "email": "", "working_hours": ""}
    })


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


# ============ Western Union Settings ============

@router.get("/settings/western-union", response_model=WesternUnionSettings)
async def get_wu_settings():
    """Get Western Union settings (MTCN base)"""
    settings = await settings_collection.find_one({"type": "western_union"}, {"_id": 0})
    if not settings:
        return WesternUnionSettings()
    settings.pop("type", None)
    return WesternUnionSettings(**settings)


@router.put("/settings/western-union", response_model=WesternUnionSettings)
async def update_wu_settings(
    settings: WesternUnionSettings,
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_BRANDING))
):
    """Update Western Union settings"""
    settings_doc = settings.model_dump()
    settings_doc["type"] = "western_union"
    settings_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await settings_collection.update_one(
        {"type": "western_union"},
        {"$set": settings_doc},
        upsert=True
    )
    
    return settings


# ============ MoneyGram Settings ============

@router.get("/settings/moneygram", response_model=MoneyGramSettings)
async def get_mg_settings():
    """Get MoneyGram settings (Reference base)"""
    settings = await settings_collection.find_one({"type": "moneygram"}, {"_id": 0})
    if not settings:
        return MoneyGramSettings()
    settings.pop("type", None)
    return MoneyGramSettings(**settings)


@router.put("/settings/moneygram", response_model=MoneyGramSettings)
async def update_mg_settings(
    settings: MoneyGramSettings,
    current_user: UserInDB = Depends(require_permission(Permission.EDIT_BRANDING))
):
    """Update MoneyGram settings"""
    settings_doc = settings.model_dump()
    settings_doc["type"] = "moneygram"
    settings_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await settings_collection.update_one(
        {"type": "moneygram"},
        {"$set": settings_doc},
        upsert=True
    )
    
    return settings


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
                "name_ku": "نۆرەکردنی دۆلار بۆ گەشتیاران",
                "description_ar": "حجز الدولار الأمريكي للسفر",
                "description_en": "Book US dollars for travel",
                "description_ku": "بە ئاسانی دۆلارەکانت نۆرە بکە پێش گەشتکردن",
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
                "name_ku": "گواستنەوەی ناوخۆیی",
                "description_ar": "تحويل أموال داخل العراق",
                "description_en": "Money transfer within Iraq",
                "description_ku": "گواستنەوەی پارە لەناو عێراقدا",
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
                "name_ku": "گواستنەوەی نێودەوڵەتی",
                "description_ar": "تحويل أموال دولي",
                "description_en": "International money transfer",
                "description_ku": "گواستنەوەی پارەی نێودەوڵەتی",
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
async def init_predefined_methods():
    """Seed predefined transfer methods if collection is empty"""
    count = await predefined_methods_collection.count_documents({})
    if count == 0:
        default_methods = [
            {
                "method_id": "western_union",
                "name_ar": "ويسترن يونيون",
                "name_en": "Western Union",
                "name_ku": "ويسترن يونيون",
                "description": "Standard transfer via Western Union",
                "fee_type": "percentage",
                "fee_value": 2.0,
                "exchange_rate": 1.0,
                "duration": "Instant",
                "fields": [
                    {
                        "field_id": "mtcn",
                        "name_ar": "رقم الحوالة (MTCN)",
                        "name_en": "MTCN Number",
                        "name_ku": "ژمارەی حەواڵە (MTCN)",
                        "field_type": "text",
                        "required": True,
                        "order": 1
                    }
                ],
                "is_active": True
            },
            {
                "method_id": "ria",
                "name_ar": "ريا",
                "name_en": "Ria Money Transfer",
                "name_ku": "ريا",
                "description": "RIA money transfer template",
                "fee_type": "percentage",
                "fee_value": 1.5,
                "exchange_rate": 1.0,
                "duration": "10-30 mins",
                "fields": [
                    {
                        "field_id": "pin_code",
                        "name_ar": "رمز التحويل (PIN)",
                        "name_en": "Reference Number",
                        "name_ku": "کۆدی حەواڵە (PIN)",
                        "field_type": "text",
                        "required": True,
                        "order": 1
                    }
                ],
                "is_active": True
            },
            {
                "method_id": "bank_dropdown_test",
                "name_ar": "تحويل بنكي",
                "name_en": "Bank Transfer",
                "name_ku": "گواستنەوەی بانکی",
                "description": "Template with dropdown field",
                "fee_type": "fixed",
                "fee_value": 5000.0,
                "fields": [
                    {
                        "field_id": "bank_name",
                        "name_ar": "اسم البنك",
                        "name_en": "Bank Name",
                        "name_ku": "ناوی بانک",
                        "field_type": "select",
                        "required": True,
                        "options": [
                            {"value": "tbi", "label": "Banque de Commerce de l'Irak (TBI)"},
                            {"value": "rafidain", "label": "Banque Rafidain"},
                            {"value": "fib", "label": "First Iraqi Bank (FIB)"}
                        ],
                        "order": 1
                    }
                ],
                "is_active": True
            }
        ]
        await predefined_methods_collection.insert_many(default_methods)
        print("Default predefined methods initialized")
