from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, BackgroundTasks
from typing import Optional, List
from datetime import datetime, timezone
import os
import uuid
import logging
from motor.motor_asyncio import AsyncIOMotorClient

from models.order import (
    OrderCreate, OrderResponse, OrderUpdate, OrderTrackRequest,
    OrderType, OrderStatus, OrderListResponse, OrderStatsResponse,
    Document, generate_order_id
)
from services.sms_service import sms_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/orders", tags=["Orders"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]
orders_collection = db.orders

# Upload directory
UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def serialize_order(order: dict) -> dict:
    """Remove MongoDB _id and ensure proper serialization"""
    if order and "_id" in order:
        del order["_id"]
    return order


@router.post("", response_model=OrderResponse)
async def create_order(order: OrderCreate, background_tasks: BackgroundTasks):
    """Create a new order"""
    now = datetime.now(timezone.utc).isoformat()
    order_id = generate_order_id(order.order_type)
    
    order_doc = {
        "order_id": order_id,
        "order_type": order.order_type.value,
        "status": OrderStatus.WAITING_PAYMENT.value,
        "customer": order.customer.model_dump(),
        "details": order.details,
        "documents": [doc.model_dump() for doc in order.documents],
        "payment_proofs": [],
        "created_at": now,
        "updated_at": now,
        "admin_notes": None
    }
    
    await orders_collection.insert_one(order_doc)
    
    # Send SMS notification for order submission (in background)
    phone = order.customer.phone
    background_tasks.add_task(sms_service.send_order_submitted, phone)
    logger.info(f"Order created: {order_id}, SMS queued for {phone}")
    
    return OrderResponse(**serialize_order(order_doc))


@router.post("/track", response_model=OrderResponse)
async def track_order(request: OrderTrackRequest):
    """Track an order by ID and type"""
    order = await orders_collection.find_one(
        {
            "order_id": request.order_id.upper(),
            "order_type": request.order_type.value
        },
        {"_id": 0}
    )
    
    if not order:
        raise HTTPException(
            status_code=404, 
            detail="الطلب غير موجود. تأكد من رقم الطلب ونوعه."
        )
    
    return OrderResponse(**order)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    """Get order by ID"""
    order = await orders_collection.find_one(
        {"order_id": order_id.upper()},
        {"_id": 0}
    )
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return OrderResponse(**order)


@router.get("", response_model=OrderListResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[OrderStatus] = None,
    order_type: Optional[OrderType] = None,
    search: Optional[str] = None
):
    """List all orders with filtering and pagination (Admin)"""
    query = {}
    
    if status:
        query["status"] = status.value
    if order_type:
        query["order_type"] = order_type.value
    if search:
        query["$or"] = [
            {"order_id": {"$regex": search, "$options": "i"}},
            {"customer.full_name": {"$regex": search, "$options": "i"}},
            {"customer.phone": {"$regex": search, "$options": "i"}}
        ]
    
    total = await orders_collection.count_documents(query)
    skip = (page - 1) * page_size
    
    cursor = orders_collection.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(page_size)
    orders = await cursor.to_list(length=page_size)
    
    return OrderListResponse(
        orders=[OrderResponse(**order) for order in orders],
        total=total,
        page=page,
        page_size=page_size
    )


@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(order_id: str, update: OrderUpdate, background_tasks: BackgroundTasks):
    """Update order status or details (Admin)"""
    now = datetime.now(timezone.utc).isoformat()
    update_doc = {"updated_at": now}
    
    # Get current order to track status changes
    current_order = await orders_collection.find_one({"order_id": order_id.upper()}, {"_id": 0})
    if not current_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    old_status = current_order.get("status")
    new_status = update.status.value if update.status else None
    
    # Track status change in history
    if update.status and new_status != old_status:
        status_entry = {
            "status": update.status.value,
            "changed_by": "Admin",  # TODO: Get from auth
            "changed_at": now,
            "reason": update.rejection_reason if update.status.value == "rejected" else None
        }
        update_doc["$push"] = {"status_history": status_entry}
        update_doc["status"] = update.status.value
    
    if update.admin_notes is not None:
        update_doc["admin_notes"] = update.admin_notes
    
    if update.details:
        # Merge with existing details
        current_details = current_order.get("details", {})
        current_details.update(update.details)
        update_doc["details"] = current_details
    
    if update.rejection_reason:
        update_doc["rejection_reason"] = update.rejection_reason
    
    # Admin-only data for traveler booking
    if update.admin_data:
        current_admin_data = current_order.get("admin_data", {}) or {}
        current_admin_data.update(update.admin_data)
        update_doc["admin_data"] = current_admin_data
    
    # Separate $push from $set
    push_ops = update_doc.pop("$push", None)
    
    result = await orders_collection.find_one_and_update(
        {"order_id": order_id.upper()},
        {"$set": update_doc, "$push": push_ops} if push_ops else {"$set": update_doc},
        return_document=True,
        projection={"_id": 0}
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Send SMS for status changes (approved/rejected)
    if new_status and new_status != old_status:
        phone = current_order.get("customer", {}).get("phone", "")
        
        if new_status == "approved":
            background_tasks.add_task(sms_service.send_order_approved, phone)
            logger.info(f"Order {order_id} approved, SMS queued for {phone}")
        
        elif new_status == "rejected":
            background_tasks.add_task(sms_service.send_order_rejected, phone)
            logger.info(f"Order {order_id} rejected, SMS queued for {phone}")
    
    return OrderResponse(**result)


@router.post("/{order_id}/payment-proof")
async def upload_payment_proof(order_id: str, file: UploadFile = File(...)):
    """Upload payment proof for an order"""
    # Verify order exists
    order = await orders_collection.find_one({"order_id": order_id.upper()})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Save file
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    file_name = f"{order_id}_{uuid.uuid4().hex[:8]}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create document record
    proof_doc = {
        "doc_type": "payment_proof",
        "file_url": f"/uploads/{file_name}",
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Update order
    result = await orders_collection.find_one_and_update(
        {"order_id": order_id.upper()},
        {
            "$push": {"payment_proofs": proof_doc},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        },
        return_document=True,
        projection={"_id": 0}
    )
    
    return {"message": "Payment proof uploaded successfully", "proof": proof_doc}


@router.post("/upload-document")
async def upload_document(
    order_type: str = Form(...),
    doc_type: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload document during order creation (before order ID is generated)"""
    # Save file
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    file_name = f"{doc_type}_{uuid.uuid4().hex}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    return {
        "doc_type": doc_type,
        "file_url": f"/uploads/{file_name}",
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }


@router.get("/stats/summary", response_model=OrderStatsResponse)
async def get_order_stats():
    """Get order statistics (Admin)"""
    pipeline = [
        {
            "$facet": {
                "by_status": [
                    {"$group": {"_id": "$status", "count": {"$sum": 1}}}
                ],
                "by_type": [
                    {"$group": {"_id": "$order_type", "count": {"$sum": 1}}}
                ],
                "total": [
                    {"$count": "count"}
                ]
            }
        }
    ]
    
    result = await orders_collection.aggregate(pipeline).to_list(1)
    
    if not result:
        return OrderStatsResponse(
            total_orders=0,
            pending_review=0,
            waiting_payment=0,
            under_review=0,
            approved=0,
            rejected=0,
            ignored=0,
            by_type={}
        )
    
    data = result[0]
    
    status_counts = {item["_id"]: item["count"] for item in data.get("by_status", [])}
    type_counts = {item["_id"]: item["count"] for item in data.get("by_type", [])}
    total = data.get("total", [{}])[0].get("count", 0)
    
    return OrderStatsResponse(
        total_orders=total,
        pending_review=status_counts.get("pending_review", 0),
        waiting_payment=status_counts.get("waiting_payment", 0),
        under_review=status_counts.get("under_review", 0),
        approved=status_counts.get("approved", 0),
        rejected=status_counts.get("rejected", 0),
        ignored=status_counts.get("ignored", 0),
        by_type=type_counts
    )


@router.delete("/{order_id}")
async def delete_order(order_id: str):
    """Delete an order (Admin only)"""
    result = await orders_collection.delete_one({"order_id": order_id.upper()})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order deleted successfully"}
