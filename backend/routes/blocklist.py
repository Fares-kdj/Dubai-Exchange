from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime, timezone
import uuid
import os

from models.blocklist import (
    BlockedEntryCreate, BlockedEntryResponse, BlockReason, BLOCK_REASON_LABELS_AR
)
from models.user import Permission, UserInDB
from routes.auth import get_current_user, check_permission

router = APIRouter(prefix="/blocklist", tags=["Blocklist"])

from database import db
blocklist_collection = db.blocklist


def normalize_phone(phone: str) -> str:
    """Normalize phone number for comparison"""
    if not phone:
        return ""
    # Remove all non-digits
    digits = ''.join(filter(str.isdigit, phone))
    # If it starts with 964, keep it as is, otherwise try to extract the last 10 digits
    if digits.startswith('964'):
        return digits
    return digits[-10:]


def normalize_name(name: str) -> str:
    """Normalize name for comparison"""
    return name.strip().lower()


async def is_blocked(full_name: str, phone: str) -> dict:
    """Check if a name or phone is blocked"""
    norm_phone = normalize_phone(phone)
    norm_name = normalize_name(full_name)
    
    # Check by phone
    blocked_by_phone = await blocklist_collection.find_one({
        "normalized_phone": norm_phone,
        "is_active": True
    }, {"_id": 0})
    
    if blocked_by_phone:
        return {"blocked": True, "reason": "phone", "entry": blocked_by_phone}
    
    # Check by name
    blocked_by_name = await blocklist_collection.find_one({
        "normalized_name": norm_name,
        "is_active": True
    }, {"_id": 0})
    
    if blocked_by_name:
        return {"blocked": True, "reason": "name", "entry": blocked_by_name}
    
    return {"blocked": False}


@router.get("/check")
async def check_if_blocked(
    full_name: str = Query(..., description="Full name to check"),
    phone: str = Query(..., description="Phone number to check")
):
    """Check if a customer is blocked (public endpoint for order submission)"""
    result = await is_blocked(full_name, phone)
    if result["blocked"]:
        return {
            "blocked": True,
            "message": "هذا العميل محظور من استخدام خدماتنا",
            "reason": result["entry"].get("reason", "other")
        }
    return {"blocked": False}


@router.get("/", response_model=List[BlockedEntryResponse])
async def list_blocked_entries(
    search: Optional[str] = None,
    reason: Optional[BlockReason] = None,
    page: int = 1,
    page_size: int = 20,
    current_user: UserInDB = Depends(get_current_user)
):
    """List all blocked entries"""
    if not check_permission(current_user, Permission.VIEW_BLOCKLIST):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لعرض قائمة الحظر")
    
    query = {"is_active": True}
    
    if search:
        query["$or"] = [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
    
    if reason:
        query["reason"] = reason.value
    
    skip = (page - 1) * page_size
    
    cursor = blocklist_collection.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(page_size)
    entries = await cursor.to_list(length=page_size)
    
    return [BlockedEntryResponse(**e) for e in entries]


@router.get("/count")
async def get_blocked_count(
    search: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_user)
):
    """Get total count of blocked entries with optional search filter"""
    if not check_permission(current_user, Permission.VIEW_BLOCKLIST):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لعرض قائمة الحظر")
    
    query = {"is_active": True}
    if search:
        query["$or"] = [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
        
    count = await blocklist_collection.count_documents(query)
    return {"count": count}


@router.post("/", response_model=BlockedEntryResponse)
async def block_customer(
    entry: BlockedEntryCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Block a customer"""
    if not check_permission(current_user, Permission.MANAGE_BLOCKLIST):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لإدارة قائمة الحظر")
    
    norm_phone = normalize_phone(entry.phone)
    norm_name = normalize_name(entry.full_name)
    
    # Check if already blocked
    existing = await blocklist_collection.find_one({
        "$or": [
            {"normalized_phone": norm_phone},
            {"normalized_name": norm_name}
        ],
        "is_active": True
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="هذا العميل محظور بالفعل")
    
    now = datetime.now(timezone.utc).isoformat()
    
    blocked_entry = {
        "block_id": str(uuid.uuid4()),
        "full_name": entry.full_name.strip(),
        "phone": entry.phone.strip(),
        "normalized_name": norm_name,
        "normalized_phone": norm_phone,
        "reason": entry.reason.value,
        "reason_notes": entry.reason_notes,
        "blocked_by": current_user.user_id,
        "blocked_by_name": current_user.name,
        "created_at": now,
        "is_active": True
    }
    
    await blocklist_collection.insert_one(blocked_entry)
    
    return BlockedEntryResponse(**{k: v for k, v in blocked_entry.items() if k not in ["normalized_name", "normalized_phone", "_id"]})


@router.delete("/{block_id}")
async def unblock_customer(
    block_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Unblock a customer"""
    if not check_permission(current_user, Permission.MANAGE_BLOCKLIST):
        raise HTTPException(status_code=403, detail="ليس لديك صلاحية لإدارة قائمة الحظر")
    
    result = await blocklist_collection.update_one(
        {"block_id": block_id},
        {"$set": {"is_active": False, "unblocked_at": datetime.now(timezone.utc).isoformat(), "unblocked_by": current_user.user_id}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="لم يتم العثور على السجل")
    
    return {"message": "تم إلغاء الحظر بنجاح"}


@router.get("/reasons")
async def get_block_reasons():
    """Get all block reasons with labels"""
    return {
        "reasons": [
            {
                "value": r.value,
                "label_ar": BLOCK_REASON_LABELS_AR.get(r, r.value),
                "label_en": r.value.replace("_", " ").title()
            }
            for r in BlockReason
        ]
    }
