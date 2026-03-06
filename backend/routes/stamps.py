from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import List, Optional
from datetime import datetime, timezone
import uuid
import os
import base64

from models.stamps import (
    StampCreate, StampUpdate, StampResponse, StampType, STAMP_TYPE_LABELS
)
from models.user import Permission, UserInDB
from routes.auth import get_current_user, check_permission

router = APIRouter(prefix="/stamps", tags=["Stamps & Airports"])

from database import db
stamps_collection = db.stamps


@router.get("/types")
async def get_stamp_types():
    """Get all stamp types with labels"""
    return {
        "types": [
            {
                "value": t.value,
                "label_ar": STAMP_TYPE_LABELS[t]["ar"],
                "label_en": STAMP_TYPE_LABELS[t]["en"]
            }
            for t in StampType
        ]
    }


@router.get("/", response_model=List[StampResponse])
async def list_stamps(
    stamp_type: Optional[StampType] = None,
    active_only: bool = False,
    current_user: UserInDB = Depends(get_current_user)
):
    """List all stamps/airports/borders"""
    if not check_permission(current_user, Permission.VIEW_AIRPORTS):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لعرض المطارات والأختام")
    
    query = {}
    if stamp_type:
        query["stamp_type"] = stamp_type.value
    if active_only:
        query["is_active"] = True
    
    cursor = stamps_collection.find(query, {"_id": 0}).sort("sort_order", 1)
    stamps = await cursor.to_list(length=100)
    
    return [StampResponse(**s) for s in stamps]


@router.get("/airports")
async def list_airports(active_only: bool = True):
    """Public: List active airports for frontend selection"""
    query = {"stamp_type": StampType.AIRPORT.value}
    if active_only:
        query["is_active"] = True
    
    cursor = stamps_collection.find(query, {"_id": 0, "stamp_id": 1, "name_ar": 1, "name_en": 1, "name_ku": 1, "stamp_image": 1}).sort("sort_order", 1)
    airports = await cursor.to_list(length=50)
    return airports


@router.get("/borders")
async def list_borders(active_only: bool = True):
    """Public: List active border crossings for frontend selection"""
    query = {"stamp_type": StampType.BORDER.value}
    if active_only:
        query["is_active"] = True
    
    cursor = stamps_collection.find(query, {"_id": 0, "stamp_id": 1, "name_ar": 1, "name_en": 1, "name_ku": 1, "stamp_image": 1}).sort("sort_order", 1)
    borders = await cursor.to_list(length=50)
    return borders


@router.post("/", response_model=StampResponse)
async def create_stamp(
    stamp: StampCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Create a new stamp/airport/border"""
    if not check_permission(current_user, Permission.MANAGE_AIRPORTS):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لإدارة المطارات والأختام")
    
    now = datetime.now(timezone.utc).isoformat()
    
    stamp_doc = {
        "stamp_id": str(uuid.uuid4()),
        "name_ar": stamp.name_ar,
        "name_en": stamp.name_en,
        "name_ku": stamp.name_ku,
        "stamp_type": stamp.stamp_type.value,
        "stamp_image": stamp.stamp_image,
        "is_active": stamp.is_active,
        "sort_order": stamp.sort_order,
        "created_at": now,
        "updated_at": now
    }
    
    await stamps_collection.insert_one(stamp_doc)
    
    return StampResponse(**{k: v for k, v in stamp_doc.items() if k != "_id"})


@router.put("/{stamp_id}", response_model=StampResponse)
async def update_stamp(
    stamp_id: str,
    stamp: StampUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Update a stamp/airport/border"""
    if not check_permission(current_user, Permission.MANAGE_AIRPORTS):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لإدارة المطارات والأختام")
    
    update_data = {k: v for k, v in stamp.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await stamps_collection.update_one(
        {"stamp_id": stamp_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="لم يتم العثور على السجل")
    
    updated = await stamps_collection.find_one({"stamp_id": stamp_id}, {"_id": 0})
    return StampResponse(**updated)


@router.delete("/{stamp_id}")
async def delete_stamp(
    stamp_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Delete a stamp/airport/border"""
    if not check_permission(current_user, Permission.MANAGE_AIRPORTS):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لإدارة المطارات والأختام")
    
    result = await stamps_collection.delete_one({"stamp_id": stamp_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="لم يتم العثور على السجل")
    
    return {"message": "تم الحذف بنجاح"}


@router.post("/{stamp_id}/upload-image")
async def upload_stamp_image(
    stamp_id: str,
    image: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_user)
):
    """Upload stamp image"""
    if not check_permission(current_user, Permission.MANAGE_AIRPORTS):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لإدارة المطارات والأختام")
    
    # Check file type
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="يجب أن يكون الملف صورة")
    
    # Read and encode image
    content = await image.read()
    if len(content) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)")
    
    # Store as base64 data URL
    base64_image = base64.b64encode(content).decode('utf-8')
    data_url = f"data:{image.content_type};base64,{base64_image}"
    
    result = await stamps_collection.update_one(
        {"stamp_id": stamp_id},
        {"$set": {"stamp_image": data_url, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="لم يتم العثور على السجل")
    
    return {"message": "تم رفع الصورة بنجاح", "image_url": data_url}


# Initialize default airports and borders
async def init_default_stamps():
    """Initialize default airports and border crossings"""
    count = await stamps_collection.count_documents({})
    if count > 0:
        return
    
    now = datetime.now(timezone.utc).isoformat()
    
    default_stamps = [
        # Airports
        {"name_ar": "مطار بغداد الدولي", "name_en": "Baghdad International Airport", "name_ku": "فڕۆکەخانەی نێودەوڵەتی بەغداد", "stamp_type": "airport", "sort_order": 1},
        {"name_ar": "مطار البصرة الدولي", "name_en": "Basra International Airport", "name_ku": "فڕۆکەخانەی نێودەوڵەتی بەسرە", "stamp_type": "airport", "sort_order": 2},
        {"name_ar": "مطار أربيل الدولي", "name_en": "Erbil International Airport", "name_ku": "فڕۆکەخانەی نێودەوڵەتی هەولێر", "stamp_type": "airport", "sort_order": 3},
        {"name_ar": "مطار السليمانية الدولي", "name_en": "Sulaymaniyah International Airport", "name_ku": "فڕۆکەخانەی نێودەوڵەتی سلێمانی", "stamp_type": "airport", "sort_order": 4},
        {"name_ar": "مطار النجف الدولي", "name_en": "Najaf International Airport", "name_ku": "فڕۆکەخانەی نێودەوڵەتی نەجەف", "stamp_type": "airport", "sort_order": 5},
        # Border crossings
        {"name_ar": "منفذ طريبيل", "name_en": "Trebil Border", "name_ku": "مەرزی تڕەیبیل", "stamp_type": "border", "sort_order": 1},
        {"name_ar": "منفذ عرعر", "name_en": "Arar Border", "name_ku": "مەرزی عەرعەر", "stamp_type": "border", "sort_order": 2},
        {"name_ar": "منفذ سفوان", "name_en": "Safwan Border", "name_ku": "مەرزی سەفوان", "stamp_type": "border", "sort_order": 3},
        {"name_ar": "منفذ إبراهيم الخليل", "name_en": "Ibrahim Khalil Border", "name_ku": "مەرزی ئیبراهیم خەلیل", "stamp_type": "border", "sort_order": 4},
        {"name_ar": "منفذ الشلامجة", "name_en": "Shalamcheh Border", "name_ku": "مەرزی شەلامچە", "stamp_type": "border", "sort_order": 5},
        # Company stamps
        {"name_ar": "ختم الشركة الرسمي", "name_en": "Official Company Stamp", "name_ku": "مۆری فەرمی کۆمپانیا", "stamp_type": "company", "sort_order": 1},
        # Signatures
        {"name_ar": "توقيع المدير العام", "name_en": "General Manager Signature", "name_ku": "واژۆی بەڕێوەبەری گشتی", "stamp_type": "signature", "sort_order": 1},
    ]
    
    for stamp in default_stamps:
        stamp["stamp_id"] = str(uuid.uuid4())
        stamp["stamp_image"] = None
        stamp["is_active"] = True
        stamp["created_at"] = now
        stamp["updated_at"] = now
    
    await stamps_collection.insert_many(default_stamps)
