from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid


class UserRole(str, Enum):
    DEVELOPER = "developer"  # Full access + manage admins
    ADMIN = "admin"  # Limited access based on permissions


class Permission(str, Enum):
    # Orders
    VIEW_ORDERS = "view_orders"
    MANAGE_ORDERS = "manage_orders"
    DELETE_ORDERS = "delete_orders"
    
    # Services
    VIEW_SERVICES = "view_services"
    MANAGE_SERVICES = "manage_services"
    
    # CMS
    EDIT_CONTENT = "edit_content"
    EDIT_BRANDING = "edit_branding"
    
    # Settings
    MANAGE_RATES = "manage_rates"
    MANAGE_COUNTRIES = "manage_countries"
    MANAGE_FORMS = "manage_forms"
    
    # System
    VIEW_STATS = "view_stats"
    MANAGE_USERS = "manage_users"  # Only developer


# Default permissions for admin
DEFAULT_ADMIN_PERMISSIONS = [
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_SERVICES,
    Permission.EDIT_CONTENT,
    Permission.MANAGE_RATES,
    Permission.VIEW_STATS,
]

# All permissions for developer
ALL_PERMISSIONS = list(Permission)


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
