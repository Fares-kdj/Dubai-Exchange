# Khair Baghdad for Exchange - PRD

## المشروع
موقع شركة **خير بغداد للصرافة** - منصة خدمات مالية متكاملة

## التصميم
- Modern White Theme with Premium/Luxury Fintech feel
- 3D elements and animations
- Glassmorphism effects
- Fully responsive (Mobile/Tablet/Desktop)
- RTL Arabic default + English + Kurdish support

---

## ما تم إنجازه ✅

### المرحلة 1: الصفحة الرئيسية ✅
- Header مع التنقل وتبديل اللغات
- Hero Section مع CTAs
- Currency Converter مع أعلام الدول
- Services Section
- Trust Section
- Contact Section
- Footer

### المرحلة 2: صفحة حجز الدولار للمسافرين ✅
- صفحة الشروط والأحكام
- استمارة الحجز (بيانات العميل، السفر، الحجز، الوثائق)
- صفحة النجاح مع QR Code ورفع إثبات الدفع

### المرحلة 3: صفحات التحويلات المالية ✅
تاريخ الإنجاز: ديسمبر 2025

#### 3.1 Transfers Hub
- صفحة رئيسية للتحويلات
- بطاقتين: تحويل محلي + تحويل دولي

#### 3.2 التحويل المحلي (Local Transfer)
- استمارة كاملة مع حساب رسوم الخدمة (2%)
- صفحة نجاح مع QR Code

#### 3.3 التحويل الدولي (International)
- Western Union
- MoneyGram
- Country-based Wizard (5 خطوات)

### المرحلة 4: Backend API ✅
تاريخ الإنجاز: فبراير 2026

#### 4.1 هيكل Backend
```
/app/backend/
├── server.py           # Main FastAPI app
├── routes/
│   └── orders.py       # Orders API routes
├── models/
│   └── order.py        # Order Pydantic models
└── requirements.txt
```

#### 4.2 Orders API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | إنشاء طلب جديد |
| POST | /api/orders/track | تتبع طلب |
| GET | /api/orders | قائمة الطلبات (مع فلاتر وصفحات) |
| GET | /api/orders/{id} | جلب طلب بالـ ID |
| PUT | /api/orders/{id} | تحديث حالة الطلب |
| DELETE | /api/orders/{id} | حذف طلب |
| POST | /api/orders/{id}/payment-proof | رفع إثبات دفع |
| GET | /api/orders/stats/summary | إحصائيات الطلبات |

#### 4.3 Order Schema
```json
{
  "order_id": "TRV-XXXXXXXX",
  "order_type": "traveler|local|western_union|moneygram|country_based",
  "status": "waiting_payment|under_review|approved|rejected",
  "customer": {
    "full_name": "string",
    "phone": "string",
    "email": "string (optional)"
  },
  "details": { /* flexible schema */ },
  "documents": [],
  "payment_proofs": [],
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### المرحلة 5: صفحة تتبع الطلب ✅
تاريخ الإنجاز: فبراير 2026

- البحث برقم الطلب ونوعه
- عرض تفاصيل الطلب الكاملة
- شريط تقدم الحالة
- QR Code للطلب
- رفع إثبات الدفع
- متصل بـ API الحقيقي

### المرحلة 6: لوحة تحكم المدير ✅
تاريخ الإنجاز: فبراير 2026

#### 6.1 تسجيل الدخول
- صفحة تسجيل دخول جميلة
- بيانات تجريبية: admin@khairbaghdad.com / admin123
- ⚠️ MOCKED: يستخدم بيانات محفوظة في Frontend

#### 6.2 لوحة التحكم الرئيسية
- إحصائيات من API الحقيقي (إجمالي الطلبات، الحالات)
- جدول أحدث الطلبات من قاعدة البيانات
- بطاقات الإجراءات السريعة

#### 6.3 إدارة الطلبات
- جدول كامل بجميع الطلبات من API
- فلاتر حسب النوع والحالة
- البحث برقم الطلب أو اسم العميل
- تغيير حالة الطلب
- حذف الطلبات
- صفحات متعددة (Pagination)

---

## المهام القادمة 📋

### P0 - عالي الأولوية
- [ ] ربط Frontend للحجوزات والتحويلات مع Backend API
- [ ] تنفيذ رفع الملفات الحقيقي (documents, payment proofs)
- [ ] تنفيذ Backend Auth للـ Admin (JWT)

### P1 - متوسط الأولوية
- [ ] CMS لتعديل محتوى الموقع
- [ ] أسعار الصرف (Rates Engine)
- [ ] PDF Generator للإيصالات

### P2 - منخفض الأولوية
- [ ] Form Builder ديناميكي
- [ ] نظام إشعارات SMS
- [ ] أختام رقمية للإيصالات
- [ ] Roles & Permissions للمستخدمين

---

## البنية التقنية

### Frontend
- React 18
- Tailwind CSS
- Shadcn/UI components
- Framer Motion
- i18next
- react-router-dom
- qrcode.react

### Backend
- FastAPI (Python)
- MongoDB (via Motor async driver)
- File uploads
- Pydantic models

### API URLs
- Frontend: https://money-transfer-hub-10.preview.emergentagent.com
- Backend API: https://money-transfer-hub-10.preview.emergentagent.com/api

---

## الملفات الرئيسية
```
/app/
├── backend/
│   ├── server.py
│   ├── routes/orders.py
│   └── models/order.py
├── frontend/src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLogin.js
│   │   │   ├── AdminLayout.js
│   │   │   ├── AdminOverview.js ★ Connected to API
│   │   │   └── AdminOrders.js ★ Connected to API
│   │   ├── booking/
│   │   ├── home/
│   │   ├── tracking/
│   │   │   └── TrackOrder.js ★ Connected to API
│   │   └── transfers/
│   ├── App.js
│   └── i18n.js
└── test_reports/
    └── iteration_3.json
```

---

## حالات الطلب
1. ⏳ في انتظار الدفع (waiting_payment)
2. 🔍 قيد المراجعة (under_review)
3. ✅ تم القبول (approved)
4. ❌ تم الرفض (rejected)

---

## ⚠️ MOCKED Features
- Admin Login: يستخدم بيانات محفوظة في localStorage
- Form submissions (Booking/Transfers): لم تُربط بعد مع Backend

---

آخر تحديث: فبراير 2026
