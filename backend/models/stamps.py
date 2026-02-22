from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone
from enum import Enum


class StampType(str, Enum):
    AIRPORT = "airport"
    BORDER = "border"
    COMPANY = "company"
    SIGNATURE = "signature"


class StampBase(BaseModel):
    name_ar: str
    name_en: Optional[str] = None
    stamp_type: StampType
    stamp_image: Optional[str] = None  # URL to uploaded image
    is_active: bool = True
    sort_order: int = 0


class StampCreate(StampBase):
    pass


class StampUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    stamp_image: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class StampResponse(StampBase):
    stamp_id: str
    created_at: str
    updated_at: str


class StampInDB(StampBase):
    stamp_id: str
    created_at: str
    updated_at: str


# Labels
STAMP_TYPE_LABELS = {
    StampType.AIRPORT: {"ar": "مطار", "en": "Airport"},
    StampType.BORDER: {"ar": "منفذ حدودي", "en": "Border Crossing"},
    StampType.COMPANY: {"ar": "ختم الشركة", "en": "Company Stamp"},
    StampType.SIGNATURE: {"ar": "توقيع", "en": "Signature"},
}
