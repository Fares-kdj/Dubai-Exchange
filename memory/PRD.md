# Khair Baghdad for Exchange - PRD

## المشروع
موقع شركة **خير بغداد للصرافة** - منصة خدمات مالية متكاملة

---

## ما تم إنجازه ✅

### المرحلة 1: الصفحة الرئيسية ✅
- Header مع التنقل وتبديل اللغات
- Hero Section مع محول العملات
- Services Section
- Trust Section + Contact + Footer

### المرحلة 2: حجز الدولار للمسافرين ✅
- الشروط والأحكام
- استمارة الحجز (4 أقسام)
- صفحة النجاح مع QR Code
- **✅ متصل بـ Backend API**

### المرحلة 3: التحويلات المالية ✅
- التحويل المحلي - **✅ متصل بـ API**
- Western Union - **✅ متصل بـ API**
- MoneyGram - **✅ متصل بـ API**
- Country-based Wizard

### المرحلة 4: صفحة تتبع الطلب ✅
- بحث برقم الطلب ونوعه
- عرض التفاصيل + QR Code
- رفع إثبات الدفع
- **✅ متصل بـ Backend API**

### المرحلة 5: Backend API ✅ (فبراير 2026)

#### نظام المصادقة (JWT)
| Endpoint | Description |
|----------|-------------|
| POST /api/auth/login | تسجيل الدخول |
| GET /api/auth/me | معلومات المستخدم |
| POST /api/auth/change-password | تغيير كلمة المرور |
| GET /api/auth/users | قائمة المستخدمين (Developer) |
| POST /api/auth/users | إضافة مستخدم (Developer) |
| PUT /api/auth/users/{id} | تعديل مستخدم |
| DELETE /api/auth/users/{id} | حذف مستخدم |
| GET /api/auth/permissions | قائمة الصلاحيات |

#### نظام الطلبات
| Endpoint | Description |
|----------|-------------|
| POST /api/orders | إنشاء طلب |
| POST /api/orders/track | تتبع طلب |
| GET /api/orders | قائمة الطلبات |
| PUT /api/orders/{id} | تحديث حالة |
| DELETE /api/orders/{id} | حذف طلب |
| GET /api/orders/stats/summary | إحصائيات |

#### نظام CMS
| Endpoint | Description |
|----------|-------------|
| GET/POST /api/cms/services | إدارة الخدمات |
| GET/POST /api/cms/countries | إدارة الدول |
| GET/PUT /api/cms/content | إدارة المحتوى |
| GET/PUT /api/cms/branding | الهوية البصرية |

### المرحلة 6: لوحة تحكم المدير ✅

#### نظام الصلاحيات (مستويين)
1. **المطور (Developer)**: كامل الصلاحيات + إدارة المستخدمين
2. **الأدمن (Admin)**: صلاحيات يحددها المطور

#### الصلاحيات المتاحة:
- عرض/إدارة/حذف الطلبات
- عرض/إدارة الخدمات
- تعديل المحتوى
- تعديل الهوية البصرية
- إدارة أسعار الصرف
- إدارة الدول
- إدارة النماذج
- عرض الإحصائيات

#### صفحات لوحة التحكم ✅
- **تسجيل الدخول** (JWT حقيقي)
- **لوحة التحكم الرئيسية** - إحصائيات حية
- **إدارة الطلبات** - جدول كامل مع فلاتر
- **إدارة الخدمات** - إضافة/تعديل/حذف
- **إدارة الدول** - مع طرق التحويل
- **إدارة المستخدمين** - مع الصلاحيات

---

## بيانات الدخول

### المطور (كامل الصلاحيات)
- **Email:** developer@khairbaghdad.com
- **Password:** dev@123456

---

## المهام القادمة 📋

### P0 - عالي الأولوية
- [ ] CMS للمحتوى النصي (hero, services, footer)
- [ ] إدارة أسعار الصرف (Rates Engine)
- [ ] رفع ملفات الوثائق مع الطلبات

### P1 - متوسط الأولوية
- [ ] إدارة الهوية البصرية (الشعار، الألوان)
- [ ] PDF Generator للإيصالات
- [ ] Form Builder ديناميكي

### P2 - منخفض الأولوية
- [ ] نظام إشعارات SMS (مزود غير جاهز)
- [ ] أختام رقمية للإيصالات
- [ ] إشعارات فورية (WebSockets)

---

## البنية التقنية

### Frontend
- React 18 + Tailwind CSS
- Shadcn/UI components
- Framer Motion
- i18next (AR/EN/KU)
- react-router-dom

### Backend
- FastAPI (Python)
- MongoDB (Motor async)
- JWT Authentication
- Passlib + Bcrypt

### ملفات الـ Backend
```
/app/backend/
├── server.py
├── routes/
│   ├── orders.py
│   ├── auth.py
│   └── cms.py
└── models/
    ├── order.py
    ├── user.py
    └── cms.py
```

---

## حالات الطلب
1. ⏳ waiting_payment - في انتظار الدفع
2. 🔍 under_review - قيد المراجعة
3. ✅ approved - تم القبول
4. ❌ rejected - تم الرفض

---

آخر تحديث: فبراير 2026
