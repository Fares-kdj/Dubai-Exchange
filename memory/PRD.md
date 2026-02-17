# Dubai International Exchange - PRD

## المشروع
موقع **شركة دبي العالمية للصرافة** - منصة خدمات مالية متكاملة

---

## ما تم إنجازه ✅

### الصفحة الرئيسية (الجديدة - بدون 3D)
- ✅ **HeroSection3D** - قسم البطل مع صور حقيقية:
  - صورة طائرة جميلة
  - صورة يد تحمل بطاقة ذهبية
  - خلفية مبنى البنك المركزي العراقي
  - شعار CBI متحرك في المنتصف
- ✅ **ServicesSection3D** - بطاقات الخدمات
- ✅ **CurrencyConverterSection** - محول عملات متكامل:
  - دعم أسعار حقيقية من API (exchangerate-api.com)
  - وضع يدوي قابل للتحكم من لوحة الإدارة
  - تحويل بين جميع العملات المدعومة
  - عرض أسعار العملات الرئيسية
- ✅ **PartnersSection3D** - شعارات الشركاء مع تمرير لانهائي
- ✅ **TrustSection3D** - قسم الثقة مع شعار البنك المركزي
- ✅ **PaymentsSection3D** - تعبئة البطاقات + USDT (صور بدلاً من 3D)
- ✅ **ContactSection** - قسم تواصل معنا:
  - معلومات الاتصال (هاتف، واتساب، إيميل، عنوان)
  - نموذج إرسال رسالة
  - أيقونات التواصل الاجتماعي
  - قابل للتعديل من CMS

### صفحة الشروط والأحكام
- ✅ **TermsPage** - صفحة احترافية مع:
  - شارة الترخيص من البنك المركزي
  - أقسام قابلة للتوسيع (Accordion)
  - 8 أقسام: مقدمة، ترخيص، خدمات، التزامات، إلغاء، قيود، خصوصية، دعم
  - قابلة للتعديل من لوحة التحكم CMS
  - دعم 3 لغات (عربي، إنجليزي، كردي)

### دعم اللغات (Multilingual)
- ✅ **العربية (RTL)** - اللغة الافتراضية
- ✅ **الإنجليزية (LTR)** - دعم كامل
- ✅ **الكردية (RTL)** - دعم كامل مع ترجمات

### الوضع الداكن/الفاتح (Dark/Light Mode)
- ✅ **ThemeContext** - إدارة السمة عبر التطبيق
- ✅ **تباين الأقسام** - انتقال من داكن لفاتح عند السكرول
- ✅ جميع المكونات تدعم الوضعين

### Backend API
- ✅ `/api/rates` - أسعار الصرف المخزنة
- ✅ `/api/rates/live/fetch` - أسعار حية من API خارجي
- ✅ `/api/rates/settings/mode` - التحكم بوضع الأسعار (يدوي/تلقائي)
- ✅ `/api/cms/terms` - تعديل الشروط والأحكام
- ✅ `/api/cms/contact` - تعديل معلومات الاتصال
- ✅ نظام الطلبات، المصادقة، الخدمات، الدول

---

## الصور المستخدمة

| الصورة | الرابط |
|--------|--------|
| طائرة Hero | https://static.prod-images.emergentagent.com/jobs/.../hero_airplane.png |
| يد + بطاقة | https://static.prod-images.emergentagent.com/jobs/.../hero_card_hand.png |
| USDT Coin | https://customer-assets.emergentagent.com/.../3D%20RENDER_.png |

---

## المهام المكتملة في هذه الجلسة ✅

1. ✅ إزالة المجسمات 3D واستبدالها بصور حقيقية
2. ✅ إضافة صورة البنك المركزي في Hero Section
3. ✅ إضافة محول العملات (API حقيقي + يدوي)
4. ✅ إضافة قسم "تواصل معنا"
5. ✅ تجديد صفحة الشروط والأحكام
6. ✅ استخدام صورة USDT المرفوعة
7. ✅ إضافة تباين بين أقسام الصفحة

---

## المهام القادمة 📋

### P1 - أولوية متوسطة
- [ ] PDF Generator للإيصالات
- [ ] Form Builder ديناميكي
- [ ] صفحات تعبئة البطاقات و USDT

### P2 - أولوية منخفضة
- [ ] نظام إشعارات SMS
- [ ] تحسين SEO
- [ ] إضافة نصوص تسويقية

---

## البنية التقنية

### Frontend
- React 18
- Tailwind CSS
- Framer Motion للحركات
- GSAP للتحريك المتقدم
- i18next للترجمة

### Backend
- FastAPI
- MongoDB (Motor)
- JWT Authentication
- Exchange Rate API (exchangerate-api.com)

### ملفات المكونات الجديدة
```
/app/frontend/src/components/
├── landing/
│   ├── LandingPage3D.js
│   ├── Header3D.js
│   ├── HeroSection3D.js (صور بدلاً من 3D)
│   ├── ServicesSection3D.js
│   ├── CurrencyConverterSection.js (جديد)
│   ├── PartnersSection3D.js
│   ├── TrustSection3D.js
│   ├── PaymentsSection3D.js (صورة USDT)
│   ├── ContactSection.js (جديد)
│   └── Footer3D.js
└── pages/
    └── TermsPage.js (جديد)
```

---

## بيانات الدخول

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| المطور | developer@khairbaghdad.com | developer |

---

## آخر تحديث
فبراير 2026 - إعادة تصميم شاملة للصفحة الرئيسية + محول العملات + صفحة الشروط
