from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum


class BlockReason(str, Enum):
    FRAUD = "fraud"
    FAKE_DOCUMENTS = "fake_documents"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"
    PAYMENT_ISSUES = "payment_issues"
    OTHER = "other"


class BlockedEntryBase(BaseModel):
    full_name: str
    phone: str
    reason: BlockReason = BlockReason.OTHER
    reason_notes: Optional[str] = None


class BlockedEntryCreate(BlockedEntryBase):
    pass


class BlockedEntryResponse(BlockedEntryBase):
    block_id: str
    blocked_by: str  # User ID who blocked
    blocked_by_name: str  # User name who blocked
    created_at: str
    is_active: bool = True


class BlockedEntryInDB(BlockedEntryBase):
    block_id: str
    blocked_by: str
    blocked_by_name: str
    created_at: str
    is_active: bool = True


# Block reason labels in Arabic
BLOCK_REASON_LABELS_AR = {
    BlockReason.FRAUD: "احتيال",
    BlockReason.FAKE_DOCUMENTS: "وثائق مزورة",
    BlockReason.SUSPICIOUS_ACTIVITY: "نشاط مشبوه",
    BlockReason.PAYMENT_ISSUES: "مشاكل في الدفع",
    BlockReason.OTHER: "أخرى",
}
