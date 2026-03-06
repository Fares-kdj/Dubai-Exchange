from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone


class ServiceField(BaseModel):
    """Dynamic form field for service"""
    field_id: str
    name_ar: str
    name_en: str
    name_ku: Optional[str] = None
    field_type: str  # text, number, select, date, file, phone, email
    required: bool = True
    options: List[Dict[str, str]] = []  # For select fields
    placeholder_ar: Optional[str] = None
    placeholder_en: Optional[str] = None
    placeholder_ku: Optional[str] = None
    validation: Optional[Dict[str, Any]] = None  # min, max, pattern, etc.
    order: int = 0


class ServiceBase(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    service_id: str
    name_ar: str
    name_en: str
    name_ku: Optional[str] = None
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    description_ku: Optional[str] = None
    icon: str = "Package"  # Lucide icon name
    color: str = "#D4AF37"  # Hex color
    is_active: bool = True
    is_hero_pinned: bool = False
    order: int = 0
    route: str  # Frontend route
    service_type: str  # traveler, local, international, etc.


class ServiceCreate(ServiceBase):
    fields: List[ServiceField] = []
    settings: Dict[str, Any] = {}  # Service-specific settings (fees, etc.)


class ServiceResponse(ServiceBase):
    fields: List[ServiceField] = []
    settings: Dict[str, Any] = {}
    created_at: str
    updated_at: str


class ServiceUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    name_ku: Optional[str] = None
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    description_ku: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None
    is_hero_pinned: Optional[bool] = None
    order: Optional[int] = None
    route: Optional[str] = None
    service_type: Optional[str] = None
    fields: Optional[List[ServiceField]] = None
    settings: Optional[Dict[str, Any]] = None


# Country for international transfers
class TransferMethod(BaseModel):
    method_id: str
    name_ar: str
    name_en: str
    name_ku: Optional[str] = None
    is_active: bool = True
    fields: List[ServiceField] = []  # Additional fields for this method
    fee_type: str = "percentage"  # percentage or fixed
    fee_value: float = 0
    exchange_rate: float = 1.0
    duration: str = ""  # e.g., "1-2h", "Instant"


class CountryConfig(BaseModel):
    country_code: str  # ISO code
    name_ar: str
    name_en: str
    name_ku: Optional[str] = None
    flag: str  # Flag emoji or URL
    currency: str
    is_active: bool = True
    transfer_methods: List[TransferMethod] = []


class CountryCreate(CountryConfig):
    pass


class CountryResponse(CountryConfig):
    created_at: str
    updated_at: str


class CountryUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    flag: Optional[str] = None
    currency: Optional[str] = None
    is_active: Optional[bool] = None
    transfer_methods: Optional[List[TransferMethod]] = None


class PredefinedMethod(TransferMethod):
    """Template for transfer methods to be reused across countries"""
    description: Optional[str] = None


class PredefinedMethodUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    name_ku: Optional[str] = None
    fee_type: Optional[str] = None
    fee_value: Optional[float] = None
    exchange_rate: Optional[float] = None
    duration: Optional[str] = None
    is_active: Optional[bool] = None
    fields: Optional[List[ServiceField]] = None
    description: Optional[str] = None


# CMS Content
class ContentBlock(BaseModel):
    block_id: str
    page: str  # home, booking, transfers, etc.
    section: str  # hero, services, footer, etc.
    content_ar: Dict[str, Any] = {}
    content_en: Dict[str, Any] = {}
    content_ku: Dict[str, Any] = {}
    is_active: bool = True
    order: int = 0


class ContentUpdate(BaseModel):
    content_ar: Optional[Dict[str, Any]] = None
    content_en: Optional[Dict[str, Any]] = None
    content_ku: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


# Branding
class BrandingSettings(BaseModel):
    logo_url: Optional[str] = None
    logo_dark_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_color: str = "#D4AF37"
    secondary_color: str = "#1E293B"
    accent_color: str = "#FCD34D"
    font_family_ar: str = "Cairo"
    font_family_en: str = "Inter"


class WesternUnionSettings(BaseModel):
    base_mtcn: str = "617-015-0012"  # Last generated or initial base
    updated_at: Optional[str] = None


class MoneyGramSettings(BaseModel):
    base_reference_number: str = "0000000000"  # Initial base for reference number
    updated_at: Optional[str] = None
