from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from enum import Enum
import uuid
import random


class OrderStatus(str, Enum):
    PENDING_REVIEW = "pending_review"  # New: قيد المراجعة
    WAITING_PAYMENT = "waiting_payment"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    IGNORED = "ignored"  # New: تم التجاهل


class OrderType(str, Enum):
    TRAVELER = "traveler"
    LOCAL = "local"
    WESTERN_UNION = "western_union"
    MONEYGRAM = "moneygram"
    COUNTRY_BASED = "country_based"
    CARD_RECHARGE = "card_recharge"
    USDT_RECHARGE = "usdt_recharge"
    INTERNATIONAL = "international" # Meta-category for filtering


def generate_order_id(order_type: OrderType) -> str:
    """Generate unique order ID based on type"""
    prefixes = {
        OrderType.TRAVELER: "TRV",
        OrderType.LOCAL: "LOC",
        OrderType.WESTERN_UNION: "WU",
        OrderType.MONEYGRAM: "MG",
        OrderType.COUNTRY_BASED: "CTR",
        OrderType.CARD_RECHARGE: "CRD",
        OrderType.USDT_RECHARGE: "USD"
    }
    prefix = prefixes.get(order_type, "ORD")
    unique_id = str(random.randint(10000000, 99999999))
    return f"{prefix}-{unique_id}"


class CustomerInfo(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    full_name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None


class Document(BaseModel):
    doc_type: str  # passport, ticket, id, payment_proof
    file_url: str
    uploaded_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class OrderBase(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    order_type: OrderType
    customer: CustomerInfo
    details: Dict[str, Any] = {}


class OrderCreate(OrderBase):
    """Schema for creating a new order"""
    documents: List[Document] = []


class OrderResponse(OrderBase):
    """Schema for order response"""
    order_id: str
    status: OrderStatus = OrderStatus.PENDING_REVIEW
    documents: List[Document] = []
    payment_proofs: List[Document] = []
    created_at: str
    updated_at: str
    admin_notes: Optional[str] = None
    admin_data: Optional[Dict[str, Any]] = None
    status_history: List[Dict[str, Any]] = []
    rejection_reason: Optional[str] = None
    customer_blocked: bool = False


class OrderUpdate(BaseModel):
    """Schema for updating order (admin)"""
    status: Optional[OrderStatus] = None
    admin_notes: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    rejection_reason: Optional[str] = None
    # Admin-only fields for traveler booking
    admin_data: Optional[Dict[str, Any]] = None


class TravelerAdminData(BaseModel):
    """Admin-only fields for traveler booking"""
    batch_number: Optional[str] = None  # رقم الوجبة
    batch_date: Optional[str] = None  # تاريخ الوجبة
    mother_name: Optional[str] = None  # اسم الأم
    ticket_number: Optional[str] = None  # رقم التذكرة
    travel_time: Optional[str] = None  # وقت السفر
    passport_number: Optional[str] = None  # رقم الجواز
    passport_issue_date: Optional[str] = None  # تاريخ الإصدار
    passport_expiry_date: Optional[str] = None  # تاريخ النفاذ
    travel_agency: Optional[str] = None  # مكتب السياحة
    travel_type: Optional[str] = None  # جوي أو بري
    airport_id: Optional[str] = None  # المطار
    border_id: Optional[str] = None  # المنفذ الحدودي
    company_stamp_id: Optional[str] = None  # ختم الشركة
    signature_id: Optional[str] = None  # التوقيع


class StatusHistoryEntry(BaseModel):
    """Status change history entry"""
    status: str
    changed_by: str
    changed_at: str
    reason: Optional[str] = None


class OrderTrackRequest(BaseModel):
    """Schema for tracking order"""
    order_id: str
    order_type: OrderType


class PaymentProofUpload(BaseModel):
    """Schema for uploading payment proof"""
    order_id: str
    file_url: str


# Response Models
class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total: int
    page: int
    page_size: int


class OrderStatsResponse(BaseModel):
    total_orders: int
    pending_review: int
    waiting_payment: int
    under_review: int
    approved: int
    rejected: int
    ignored: int
    by_type: Dict[str, int]
