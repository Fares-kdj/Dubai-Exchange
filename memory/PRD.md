# Khair Baghdad for Exchange - PRD (Product Requirements Document)

## المشروع
موقع شركة **خير بغداد للصرافة** - منصة خدمات مالية متكاملة

## الرؤية
موقع احترافي وموثوق يقدم خدمات صرافة وتحويلات مالية للعملاء في العراق والمنطقة

---

## المتطلبات الأساسية

### اللغات
- **العربية (RTL)**: اللغة الافتراضية
- **الإنجليزية (LTR)**: مدعومة
- **الكردية (RTL)**: مدعومة

### التصميم
- Modern White Theme with Premium/Luxury Fintech feel
- 3D elements and animations
- Glassmorphism effects
- Fully responsive (Mobile/Tablet/Desktop)

---

## ما تم إنجازه ✅

### المرحلة 1: الصفحة الرئيسية (مكتملة)
- **التاريخ**: يناير 2025
- **المكونات**:
  - Header مع التنقل وتبديل اللغات
  - Hero Section مع CTAs
  - Currency Converter مع أعلام الدول
  - Services Section مع روابط للخدمات
  - Trust Section
  - Contact Section
  - Footer

### المرحلة 2: صفحة حجز الدولار للمسافرين (مكتملة)
- **التاريخ**: فبراير 2025
- **المكونات**:
  - **صفحة الشروط والأحكام** (TermsAndConditions.js)
    - شروط الحجز
    - الوثائق المطلوبة
    - سياسة الإلغاء
    - الدول المحظورة
    - Checkbox للموافقة
  - **استمارة الحجز** (BookingForm.js)
    - بيانات العميل (الاسم، الهاتف)
    - بيانات السفر (النوع، الوجهة، التاريخ، مكان الاستلام)
    - بيانات الحجز (المبلغ بالدولار، الحساب التلقائي بالدينار، طريقة الدفع)
    - رفع الوثائق (جواز السفر، التذكرة، صورة شخصية)
  - **صفحة النجاح** (SuccessPage.js)
    - رقم الطلب مع زر نسخ
    - QR Code للطلب
    - ملخص كامل للبيانات
    - حالة الطلب (في انتظار الدفع)
    - تعليمات الدفع
    - رفع إثبات الدفع

---

## المهام القادمة 📋

### المرحلة 3: Backend API للحجز (P1)
- [ ] إنشاء endpoint لحفظ الحجوزات `/api/bookings`
- [ ] رفع الملفات وحفظها
- [ ] حفظ الطلبات في MongoDB
- [ ] API لجلب سعر الصرف الحالي

### المرحلة 4: صفحة التحويلات المالية (P2)
- [ ] Transfer Hub
- [ ] Local Transfer Form
- [ ] International Transfer (Western Union, MoneyGram)
- [ ] Country-based Transfer Wizard

### المرحلة 5: صفحة تتبع الطلبات (P3)
- [ ] البحث برقم الطلب
- [ ] عرض تفاصيل الطلب والحالة
- [ ] رفع إثبات الدفع

### المرحلة 6: لوحة تحكم المدير (P4)
- [ ] تسجيل دخول المدير
- [ ] إدارة الطلبات
- [ ] CMS لتعديل المحتوى
- [ ] Form Builder
- [ ] Rates Engine
- [ ] PDF Generator للإيصالات
- [ ] نظام SMS

---

## البنية التقنية

### Frontend
- React 18
- Tailwind CSS
- Shadcn/UI components
- Framer Motion
- i18next for translations
- react-router-dom

### Backend
- FastAPI (Python)
- MongoDB
- File uploads

### Database Schema (مقترح)
```javascript
// Orders Collection
{
  orderId: "TRV-12345678",
  type: "traveler_booking",
  status: "waiting_payment" | "under_review" | "approved" | "rejected",
  customer: {
    fullName: String,
    phone: String
  },
  travel: {
    type: "air" | "land",
    destination: String,
    date: Date,
    pickupLocation: String
  },
  booking: {
    usdAmount: Number,
    iqdAmount: Number,
    paymentMethod: String
  },
  documents: {
    passport: String, // file path
    ticket: String,
    personalPhoto: String
  },
  paymentProofs: [String], // array of file paths
  createdAt: Date,
  updatedAt: Date
}
```

---

## Mocked Features (تحتاج تنفيذ)
1. **سعر الصرف**: حالياً 1500 د.ع/$ (hardcoded)
2. **إرسال الطلب**: محاكاة بـ setTimeout (بدون حفظ حقيقي)
3. **رفع إثبات الدفع**: محاكاة فقط

---

## الملفات المرجعية
- `/app/frontend/src/components/booking/` - مكونات صفحة الحجز
- `/app/frontend/src/components/home/` - مكونات الصفحة الرئيسية
- `/app/frontend/src/i18n.js` - ملف الترجمات
- `/app/frontend/src/context/LanguageContext.js` - سياق اللغة

---

آخر تحديث: فبراير 2025
