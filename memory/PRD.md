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
- استمارة كاملة:
  - اسم المرسل/المستلم
  - محافظة المرسل/المستلم (18 محافظة عراقية)
  - رقم الهاتف
  - المبلغ مع حساب رسوم الخدمة (2%)
  - طريقة الدفع
- صفحة نجاح مع QR Code

#### 3.3 التحويل الدولي (International)
**صفحة اختيار نوع التحويل:**
- ويسترن يونيون
- موني جرام
- تحويل حسب الدولة

**Western Union:**
- استمارة مع رفع صورة الهوية
- اختيار العملة والدولة
- حساب المبلغ بالدينار العراقي

**MoneyGram:**
- نفس ميزات Western Union

**Country-based Wizard (5 خطوات):**
1. إدخال المبلغ
2. اختيار الدولة (مع أعلام وبحث)
3. اختيار طريقة التحويل المحلية (ديناميكي حسب الدولة)
4. ملخص التحويل
5. معلومات المرسل والمستلم

**الدول المدعومة:**
- الجزائر (بريدي موب، CCP، بنكي)
- مصر (فودافون كاش، إنستاباي، بنكي)
- تركيا (باباره، EFT، بنكي)
- الأردن (كليك، بنكي)
- الهند (UPI، بنكي)
- باكستان (جاز كاش، بنكي)

---

## المهام القادمة 📋

### المرحلة 4: Backend API (P1)
- [ ] إنشاء endpoints للحجوزات والتحويلات
- [ ] رفع الملفات وحفظها
- [ ] حفظ الطلبات في MongoDB
- [ ] API لجلب أسعار الصرف

### المرحلة 5: صفحة تتبع الطلبات (P2)
- [ ] البحث برقم الطلب
- [ ] عرض تفاصيل الطلب والحالة
- [ ] رفع إثبات الدفع

### المرحلة 6: لوحة تحكم المدير (P3)
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
- i18next
- react-router-dom
- qrcode.react

### Backend (مطلوب)
- FastAPI (Python)
- MongoDB
- File uploads

### حالات الطلب
1. في انتظار الدفع
2. قيد المراجعة
3. تم القبول
4. تم الرفض

---

## MOCKED Features (تحتاج تنفيذ Backend)
- أسعار الصرف (hardcoded)
- رسوم الخدمة (2% hardcoded)
- حفظ الطلبات (setTimeout simulation)
- طرق التحويل حسب الدولة (hardcoded)

---

## الملفات الرئيسية
```
/app/frontend/src/
├── components/
│   ├── booking/           # حجز الدولار للمسافرين
│   ├── home/              # الصفحة الرئيسية
│   ├── transfers/         # التحويلات المالية
│   │   ├── TransfersHub.js
│   │   ├── LocalTransfer.js
│   │   ├── InternationalSelector.js
│   │   ├── WesternUnion.js
│   │   ├── MoneyGram.js
│   │   ├── CountryWizard.js
│   │   └── TransferSuccess.js
│   └── ui/                # shadcn components
├── context/
│   └── LanguageContext.js
├── App.js
└── i18n.js
```

---

آخر تحديث: ديسمبر 2025
