from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from enum import Enum
import uuid


class OrderStatus(str, Enum):
    WAITING_PAYMENT = "waiting_payment"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class OrderType(str, Enum):
    TRAVELER = "traveler"
    LOCAL = "local"
    WESTERN_UNION = "western_union"
    MONEYGRAM = "moneygram"
    COUNTRY_BASED = "country_based"


def generate_order_id(order_type: OrderType) -> str:
    """Generate unique order ID based on type"""
    prefixes = {
        OrderType.TRAVELER: "TRV",
        OrderType.LOCAL: "LOC",
        OrderType.WESTERN_UNION: "WU",
        OrderType.MONEYGRAM: "MG",
        OrderType.COUNTRY_BASED: "CTR"
    }
    prefix = prefixes.get(order_type, "ORD")
    unique_id = str(uuid.uuid4().hex)[:8].upper()
    return f"{prefix}-{unique_id}"


class CustomerInfo(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    full_name: str
    phone: str
    email: Optional[str] = None


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
    status: OrderStatus = OrderStatus.WAITING_PAYMENT
    documents: List[Document] = []
    payment_proofs: List[Document] = []
    created_at: str
    updated_at: str
    admin_notes: Optional[str] = None


class OrderUpdate(BaseModel):
    """Schema for updating order (admin)"""
    status: Optional[OrderStatus] = None
    admin_notes: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


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
    waiting_payment: int
    under_review: int
    approved: int
    rejected: int
    by_type: Dict[str, int]
