from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
import uuid

from models.user import (
    UserCreate, UserResponse, UserUpdate, UserInDB, UserRole,
    LoginRequest, TokenResponse, PasswordChangeRequest,
    Permission, DEFAULT_ADMIN_PERMISSIONS, ALL_PERMISSIONS, PERMISSION_LABELS_AR
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.environ.get("JWT_SECRET", "khair-baghdad-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

from database import db
users_collection = db.users


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserInDB:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await users_collection.find_one({"user_id": user_id}, {"_id": 0})
    if user is None:
        raise credentials_exception
    
    return UserInDB(**user)


def check_permission(user: UserInDB, required_permission: Permission) -> bool:
    """Check if user has required permission"""
    if user.role == UserRole.DEVELOPER:
        return True  # Developer has all permissions
    return required_permission.value in user.permissions


def require_permission(permission: Permission):
    """Dependency to require specific permission"""
    async def check(current_user: UserInDB = Depends(get_current_user)):
        if not check_permission(current_user, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )
        return current_user
    return check


def require_developer():
    """Dependency to require developer role"""
    async def check(current_user: UserInDB = Depends(get_current_user)):
        if current_user.role != UserRole.DEVELOPER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Developer access required"
            )
        return current_user
    return check


async def init_developer_account():
    """Initialize or update default developer account"""
    developer_email = "developer@dubai-exchange.com"
    developer_password_plain = "dev@123456"
    
    existing = await users_collection.find_one({"role": "developer"})
    if not existing:
        developer = {
            "user_id": str(uuid.uuid4()),
            "email": developer_email,
            "name": "المطور",
            "role": "developer",
            "permissions": [p.value for p in ALL_PERMISSIONS],
            "hashed_password": hash_password(developer_password_plain),
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "last_login": None
        }
        await users_collection.insert_one(developer)
        print(f"Default developer account created: {developer_email} / {developer_password_plain}")
    else:
        # Ensure email and password are up to date with new branding
        if existing.get("email") != developer_email:
            await users_collection.update_one(
                {"user_id": existing["user_id"]},
                {"$set": {
                    "email": developer_email,
                    "hashed_password": hash_password(developer_password_plain),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            print(f"Developer account updated to new branding: {developer_email}")


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login and get access token"""
    user = await users_collection.find_one({"email": request.email.lower()}, {"_id": 0})
    
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="بيانات الدخول غير صحيحة"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="الحساب معطل"
        )
    
    # Update last login (silently ignore if write operations are not supported)
    try:
        await users_collection.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
        )
    except Exception:
        pass  # Non-critical: ignore if Atlas SQL endpoint doesn't support writes
    
    access_token = create_access_token(data={"sub": user["user_id"]})
    
    user_response = UserResponse(
        user_id=user["user_id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        permissions=user.get("permissions", []),
        is_active=user.get("is_active", True),
        created_at=user["created_at"],
        updated_at=user["updated_at"],
        last_login=user.get("last_login")
    )
    
    return TokenResponse(access_token=access_token, user=user_response)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserInDB = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse(
        user_id=current_user.user_id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        permissions=current_user.permissions,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
        last_login=current_user.last_login
    )


@router.post("/change-password")
async def change_password(
    request: PasswordChangeRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """Change own password"""
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="كلمة المرور الحالية غير صحيحة"
        )
    
    new_hash = hash_password(request.new_password)
    await users_collection.update_one(
        {"user_id": current_user.user_id},
        {"$set": {
            "hashed_password": new_hash,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {"message": "تم تغيير كلمة المرور بنجاح"}


# ============ Admin Management (Developer Only) ============

@router.get("/users", response_model=List[UserResponse])
async def list_users(current_user: UserInDB = Depends(require_developer())):
    """List all users (Developer only)"""
    cursor = users_collection.find({}, {"_id": 0, "hashed_password": 0})
    users = await cursor.to_list(length=100)
    return [UserResponse(**u) for u in users]


@router.post("/users", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    current_user: UserInDB = Depends(require_developer())
):
    """Create new admin user (Developer only)"""
    # Check if email exists
    existing = await users_collection.find_one({"email": user.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="البريد الإلكتروني مستخدم بالفعل"
        )
    
    # Only developer can create developer accounts
    if user.role == UserRole.DEVELOPER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="لا يمكن إنشاء حساب مطور آخر"
        )
    
    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "user_id": str(uuid.uuid4()),
        "email": user.email.lower(),
        "name": user.name,
        "role": user.role.value,
        "permissions": user.permissions if user.permissions else [p.value for p in DEFAULT_ADMIN_PERMISSIONS],
        "hashed_password": hash_password(user.password),
        "is_active": user.is_active,
        "created_at": now,
        "updated_at": now,
        "last_login": None
    }
    
    await users_collection.insert_one(user_doc)
    
    return UserResponse(**{k: v for k, v in user_doc.items() if k != "hashed_password"})


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    update: UserUpdate,
    current_user: UserInDB = Depends(require_developer())
):
    """Update user (Developer only)"""
    user = await users_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")
    
    # Cannot modify developer account role
    if user["role"] == "developer" and current_user.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="لا يمكن تعديل حساب المطور"
        )
    
    update_doc = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    if update.email is not None:
        # Check if email exists
        existing = await users_collection.find_one({
            "email": update.email.lower(),
            "user_id": {"$ne": user_id}
        })
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="البريد الإلكتروني مستخدم بالفعل"
            )
        update_doc["email"] = update.email.lower()
    
    if update.name is not None:
        update_doc["name"] = update.name
    
    if update.password is not None:
        update_doc["hashed_password"] = hash_password(update.password)
    
    if update.permissions is not None and user["role"] != "developer":
        update_doc["permissions"] = update.permissions
    
    if update.is_active is not None and user["role"] != "developer":
        update_doc["is_active"] = update.is_active
    
    result = await users_collection.find_one_and_update(
        {"user_id": user_id},
        {"$set": update_doc},
        return_document=True,
        projection={"_id": 0, "hashed_password": 0}
    )
    
    return UserResponse(**result)


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: UserInDB = Depends(require_developer())
):
    """Delete user (Developer only)"""
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")
    
    if user["role"] == "developer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="لا يمكن حذف حساب المطور"
        )
    
    await users_collection.delete_one({"user_id": user_id})
    return {"message": "تم حذف المستخدم بنجاح"}


@router.get("/permissions")
async def list_permissions(current_user: UserInDB = Depends(require_developer())):
    """List all available permissions (Developer only)"""
    return {
        "permissions": [
            {
                "value": p.value,
                "label_ar": PERMISSION_LABELS_AR.get(p, p.value),
                "label_en": p.value.replace("_", " ").title()
            }
            for p in Permission
            if p != Permission.MANAGE_USERS  # Developer only permission
        ]
    }


def get_permission_label_ar(permission: Permission) -> str:
    return PERMISSION_LABELS_AR.get(permission, permission.value)
