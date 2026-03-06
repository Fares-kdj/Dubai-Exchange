from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid


class UserRole(str, Enum):
    DEVELOPER = "developer"  # Full access + manage admins
    ADMIN = "admin"  # Limited access based on permissions


class Permission(str, Enum):
    # Dashboard
    VIEW_DASHBOARD = "view_dashboard"
    
    # Orders - Per Service Type
    VIEW_ORDERS_TRAVELER = "view_orders_traveler"
    VIEW_ORDERS_LOCAL = "view_orders_local"
    VIEW_ORDERS_INTERNATIONAL = "view_orders_international"
    VIEW_ORDERS_USDT = "view_orders_usdt"
    VIEW_ORDERS_CARD = "view_orders_card"
    
    # Order Actions
    APPROVE_ORDERS = "approve_orders"
    REJECT_ORDERS = "reject_orders"
    EDIT_ORDERS = "edit_orders"
    DELETE_ORDERS = "delete_orders"
    PRINT_RECEIPTS = "print_receipts"
    
    # Blocklist
    VIEW_BLOCKLIST = "view_blocklist"
    MANAGE_BLOCKLIST = "manage_blocklist"
    
    # Services
    VIEW_SERVICES = "view_services"
    MANAGE_SERVICES = "manage_services"
    
    # Countries & Payout Methods
    VIEW_COUNTRIES = "view_countries"
    MANAGE_COUNTRIES = "manage_countries"
    
    # Exchange Rates
    VIEW_RATES = "view_rates"
    MANAGE_RATES = "manage_rates"
    
    # Airports & Stamps
    VIEW_AIRPORTS = "view_airports"
    MANAGE_AIRPORTS = "manage_airports"
    
    # CMS & Branding (Developer Only by default)
    EDIT_CONTENT = "edit_content"
    EDIT_BRANDING = "edit_branding"
    
    # System (Developer Only)
    MANAGE_USERS = "manage_users"


# Default permissions for admin
DEFAULT_ADMIN_PERMISSIONS = [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ORDERS_TRAVELER,
    Permission.VIEW_ORDERS_LOCAL,
    Permission.VIEW_ORDERS_INTERNATIONAL,
    Permission.VIEW_ORDERS_USDT,
    Permission.VIEW_ORDERS_CARD,
    Permission.APPROVE_ORDERS,
    Permission.REJECT_ORDERS,
    Permission.EDIT_ORDERS,
    Permission.PRINT_RECEIPTS,
    Permission.VIEW_BLOCKLIST,
    Permission.MANAGE_BLOCKLIST,
    Permission.VIEW_SERVICES,
    Permission.MANAGE_SERVICES,
    Permission.VIEW_COUNTRIES,
    Permission.MANAGE_COUNTRIES,
    Permission.VIEW_RATES,
    Permission.MANAGE_RATES,
    Permission.VIEW_AIRPORTS,
    Permission.MANAGE_AIRPORTS,
]

# All permissions for developer
ALL_PERMISSIONS = list(Permission)

# Permission labels in Arabic
PERMISSION_LABELS_AR = {
    Permission.VIEW_DASHBOARD: "عرض لوحة التحكم",
    Permission.VIEW_ORDERS_TRAVELER: "عرض طلبات حجز المسافرين",
    Permission.VIEW_ORDERS_LOCAL: "عرض طلبات التحويل المحلي",
    Permission.VIEW_ORDERS_INTERNATIONAL: "عرض طلبات التحويل الدولي",
    Permission.VIEW_ORDERS_USDT: "عرض طلبات USDT",
    Permission.VIEW_ORDERS_CARD: "عرض طلبات شحن البطاقات",
    Permission.APPROVE_ORDERS: "قبول الطلبات",
    Permission.REJECT_ORDERS: "رفض الطلبات",
    Permission.EDIT_ORDERS: "تعديل الطلبات",
    Permission.DELETE_ORDERS: "حذف الطلبات",
    Permission.PRINT_RECEIPTS: "طباعة الإيصالات",
    Permission.VIEW_BLOCKLIST: "عرض قائمة الحظر",
    Permission.MANAGE_BLOCKLIST: "إدارة قائمة الحظر",
    Permission.VIEW_SERVICES: "عرض الخدمات",
    Permission.MANAGE_SERVICES: "إدارة الخدمات",
    Permission.VIEW_COUNTRIES: "عرض الدول",
    Permission.MANAGE_COUNTRIES: "إدارة الدول",
    Permission.VIEW_RATES: "عرض أسعار الصرف",
    Permission.MANAGE_RATES: "إدارة أسعار الصرف",
    Permission.VIEW_AIRPORTS: "عرض المطارات والأختام",
    Permission.MANAGE_AIRPORTS: "إدارة المطارات والأختام",
    Permission.EDIT_CONTENT: "تعديل المحتوى",
    Permission.EDIT_BRANDING: "تعديل الهوية",
    Permission.MANAGE_USERS: "إدارة المستخدمين",
}


class UserBase(BaseModel):
    email: str
    name: str
    role: UserRole = UserRole.ADMIN
    permissions: List[str] = []
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    password: Optional[str] = None
    permissions: Optional[List[str]] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    user_id: str
    created_at: str
    updated_at: str
    last_login: Optional[str] = None


class UserInDB(UserBase):
    user_id: str
    hashed_password: str
    created_at: str
    updated_at: str
    last_login: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
