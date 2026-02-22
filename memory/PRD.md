# Dubai International Exchange - PRD

## المشروع
موقع **شركة دبي العالمية للصرافة** - منصة خدمات مالية متكاملة

---

## ما تم إنجازه ✅

### الصفحة الرئيسية (تصميم جديد كامل)
- ✅ **HeroSection** - قسم البطل:
  - صورة طائرة جميلة + يد تحمل بطاقة ذهبية
  - **صورة البنك المركزي في الخلفية** (واضحة في كلا الوضعين)
  - شعار CBI متحرك في المنتصف
  - ألوان ذهبية/أمبر جميلة في الوضع الفاتح
  
- ✅ **GlobalSection** - قسم التعاملات الدولية (جديد):
  - رسالة "+50 دولة حول العالم"
  - قائمة الدول المدعومة مع الأعلام (12 دولة)
  - ميزات: تحويل فوري، آمن، 24/7
  - صورة كرة أرضية ذهبية متحركة
  
- ✅ **ServicesSection** - بطاقات الخدمات (4 خدمات)

- ✅ **CurrencyConverterSection** - محول العملات (تصميم جديد فاخر)

- ✅ **DevicesSection** - قسم الأجهزة مع صور جديدة

- ✅ **PartnersSection** - شعارات 6 شركاء
- ✅ **TrustSection** - شعار CBI + نقاط الثقة
- ✅ **PaymentsSection** - تعبئة البطاقات + USDT
- ✅ **ContactSection** - نموذج اتصال + سوشيال ميديا
- ✅ **Footer** - معلومات الشركة + روابط قانونية

### شاشة البداية (Splash Screen) ✅ 
- ✅ شاشة بداية متحركة فاخرة
- ✅ صور خلفية مختلفة للوضعين (داكن/فاتح) بشفافية منخفضة
- ✅ شعار الشركة مع انيميشن

### الصفحات القانونية ✅
- ✅ **سياسة الخصوصية** (`/privacy-policy`) - محتوى مختصر
- ✅ **شروط الاستخدام** (`/terms-of-use`) - محتوى مختصر  
- ✅ **إشعار قانوني** (`/legal-notice`) - اسم الشركة ونطاق الخدمات
- ✅ **الفوتر** - روابط + حقوق النشر: "© 2026 Dubai International Company LLC"

### صفحة تتبع الطلب ✅
- ✅ دعم كامل للوضع الداكن/الفاتح
- ✅ تصميم متناسق مع باقي الصفحات

### حجز الدولار للمسافرين ✅
- ✅ قسم "بيانات الحجز" - دعم الثيم
- ✅ قسم "رفع الوثائق" - دعم الثيم

### التحويلات الدولية حسب البلد ✅
- ✅ منطق عملة المستلم:
  - **للتحويل البنكي**: 3 خيارات (USD / EUR / العملة المحلية)
  - **للطرق غير البنكية**: العملة المحلية تلقائياً مع رسالة توضيحية

### لوحة إدارة المحتوى (CMS) ✅
- ✅ تبويب الشروط والأحكام
- ✅ تبويب معلومات الاتصال
- ✅ تبويب إعدادات الأسعار

### التصميم المرئي
- ✅ **الوضع الداكن**: ألوان slate مع ذهبي
- ✅ **الوضع الفاتح**: ألوان amber/yellow مع أبيض
- ✅ **100% تناسق الثيم** عبر جميع الصفحات

### دعم اللغات
- ✅ العربية (RTL) - الافتراضية
- ✅ الإنجليزية (LTR)
- ✅ الكردية (RTL)

---

## المهام القادمة 📋

### P1 - عالية الأولوية:
1. **Backend لرفع إثبات الدفع** - إنشاء endpoint لرفع الملفات
2. **Backend لحقول الطلب الجديدة** - تحديث model الطلب لتخزين `recipient_currency`

### P2 - لوحة الإدارة:
1. إدارة الطلبات لكل خدمة منفصلة
2. إجراءات المدير (موافقة/رفض/حظر)
3. إدارة قائمة الحظر
4. منشئ النماذج الديناميكي

### P3 - تحسينات:
1. توليد PDF للإيصالات
2. إعادة تسمية ملفات المكونات (إزالة "3D" من الأسماء)

---

## البنية التقنية

### Frontend
- React 18
- Tailwind CSS
- Framer Motion للانيميشن
- Shadcn/UI Components
- React Router v6

### Backend  
- FastAPI
- MongoDB
- PyMongo

### الملفات الرئيسية

| الملف | الوصف |
|-------|-------|
| `/app/frontend/src/components/ui/SplashScreen.js` | شاشة البداية |
| `/app/frontend/src/components/landing/LandingPage3D.js` | الصفحة الرئيسية |
| `/app/frontend/src/components/booking/BookingForm.js` | نموذج حجز الدولار |
| `/app/frontend/src/components/tracking/TrackOrder.js` | تتبع الطلب |
| `/app/frontend/src/components/transfers/CountryWizard.js` | تحويل حسب البلد |
| `/app/frontend/src/components/pages/*.js` | الصفحات القانونية |

---

## بيانات الاختبار

| الحقل | القيمة |
|-------|-------|
| Email | developer@khairbaghdad.com |
| Password | developer |
| PUT /api/cms/contact | تحديث الاتصال (أدمن) |

---

## المهام القادمة 📋

### P0 - عاجل (تم إنجازها جميعاً ✅)
- ✅ واجهة إدارة المحتوى (CMS) في لوحة التحكم
- ✅ صفحة تعبئة البطاقات
- ✅ صفحة شحن USDT
- ✅ إصلاح تخطيط Hero - المحتوى على اليسار للديسكتوب
- ✅ إصلاح الثيم في جميع الصفحات
- ✅ طرق الدفع الموحدة (Zain Cash, Mastercard Al-Rafidain, FIB)
- ✅ رسوم 2% على جميع الخدمات عدا Traveler Booking
- ✅ Micro-animations للأزرار
- ✅ إعادة تصميم محول العملات بشكل premium
- ✅ صفحة النجاح الموحدة (QR Code, WhatsApp, رفع الإثبات)
- ✅ Splash Screen Premium 3D مع شعار وتأثيرات
- ✅ Local Transfer - إضافة حقل عملة المستلم (IQD/USD)
- ✅ إعادة تصميم صفحة International Transfer Options (3-card layout)

### P1 - متوسطة (جاري العمل)
- [ ] PDF Generator للإيصالات
- [ ] ربط رفع إثبات الدفع مع Backend (حالياً MOCKED)
- [ ] تحديث Country-based International Transfer لدعم عملة المستلم المتغيرة
- [ ] تعديلات لوحة التحكم المتقدمة

### P2 - منخفضة
- [ ] لوحة الإدارة: صفحات طلبات منفصلة لكل خدمة
- [ ] إدارة قائمة الحظر (Blocklist)
- [ ] إضافة الاسم القانوني للشركة في Footer
- [ ] الصفحات القانونية (سياسة الخصوصية، شروط الاستخدام)
- [ ] نظام إشعارات SMS
- [ ] تحسين SEO
- [ ] تحليلات Google Analytics

---

## بيانات الدخول

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| المطور | developer@khairbaghdad.com | developer |

---

## البنية التقنية

```
/app/frontend/src/components/
├── ui/
│   └── SplashScreen.js (جديد - شاشة تحميل premium)
├── landing/
│   ├── LandingPage3D.js
│   ├── Header3D.js
│   ├── HeroSection3D.js (micro-animations محسنة)
│   ├── CurrencyConverterSection.js (تصميم premium)
│   ├── DevicesSection.js
│   └── Footer3D.js
├── booking/
│   ├── TravelerBooking.js
│   ├── TermsAndConditions.js
│   └── BookingForm.js
├── transfers/
│   ├── LocalTransfer.js (+ عملة المستلم)
│   ├── InternationalSelector.js (تصميم 3-card premium)
│   ├── WesternUnion.js
│   ├── MoneyGram.js
│   ├── CountryWizard.js
│   ├── TransfersHub.js (animations محسنة)
│   └── TransferSuccess.js
├── services/
│   ├── CardRecharge.js
│   ├── USDTRecharge.js
│   └── ServiceSuccess.js (QR, WhatsApp, Upload)
└── config/
    └── payments.js
```

---

## MOCKED APIs (تحتاج ربط حقيقي)
- رفع إثبات الدفع في ServiceSuccess.js

---

## آخر تحديث
فبراير 2026 - إضافة Splash Screen Premium 3D، حقل عملة المستلم في Local Transfer (IQD/USD)، إعادة تصميم صفحة International Transfer Options بتخطيط 3 بطاقات premium
