# Khair Baghdad / Dubai International Exchange - PRD

## المشروع
موقع **شركة دبي العالمية للصرافة** - منصة خدمات مالية متكاملة

---

## ما تم إنجازه ✅

### الصفحة الرئيسية 3D (جديدة) ✨
- ✅ **HeroSection3D** - قسم البطل مع عناصر 3D (طائرة + بطاقة ذهبية)
- ✅ **ServicesSection3D** - بطاقات الخدمات 3D (حجز الدولار، التحويلات، تعبئة البطاقات، USDT)
- ✅ **PartnersSection3D** - شعارات الشركاء (زين كاش، FIB، TBI، الطيف، الرشيد، الرافدين)
- ✅ **TrustSection3D** - قسم الثقة مع شعار البنك المركزي العراقي + Parallax
- ✅ **PaymentsSection3D** - بطاقة 3D + USDT Token 3D
- ✅ **Header3D** - رأس الصفحة الجديد مع الشعار الجديد
- ✅ **Footer3D** - تذييل جديد مع معلومات الاتصال

### الهوية الجديدة
- ✅ اسم الشركة: **شركة دبي العالمية للصرافة**
- ✅ شعارات جديدة (logo_color, logo_white, logo_black, iconmark)
- ✅ شعارات الشركاء الحقيقية
- ✅ شعار وصور البنك المركزي العراقي

### Frontend
- ✅ حجز الدولار للمسافرين (الشروط، الاستمارة، النجاح)
- ✅ التحويلات المالية (محلي، WU، MG، Country-based)
- ✅ صفحة تتبع الطلب
- ✅ الوضع الداكن/الفاتح
- ✅ قسم واتساب في صفحات النجاح
- ✅ أعلام الدول في التحويل حسب الدولة

### Backend API
- ✅ نظام الطلبات (CRUD + Stats)
- ✅ نظام المصادقة JWT (Developer + Admin)
- ✅ إدارة الخدمات والدول وأسعار الصرف
- ✅ لوحة تحكم الأدمن كاملة

---

## ملفات Assets الجديدة

### نماذج 3D
- airplane.glb
- credit_card.glb
- usdt.glb

### شعارات الشركة
- logo_color.svg, logo_white.svg, logo_black.svg
- iconmark_white.svg, iconmark_black.svg

### شعارات الشركاء
- zaincash.jpg, fib.png, tbi.png, altayf.png, rasheed.png, rafidain.svg

### البنك المركزي
- cbi_logo.png
- cbi_building_01.webp, cbi_building_02.webp, cbi_building_03.jpg

### البطاقة
- card.svg, card_texture.png

---

## بيانات الدخول

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| المطور | developer@khairbaghdad.com | developer |

---

## المهام القادمة 📋

### P0 - أولوية قصوى
- [ ] تجديد صفحة الشروط والأحكام (تصميم ومحتوى جديد + CMS)
- [ ] ربط محتوى CMS بالصفحات (الشروط، الواتساب، إلخ)

### P1 - متوسط الأولوية
- [ ] PDF Generator للإيصالات
- [ ] Form Builder ديناميكي
- [ ] صفحات تعبئة البطاقات و USDT

### P2 - منخفض الأولوية
- [ ] نظام إشعارات SMS
- [ ] تحسين أداء نماذج 3D (تحميل كسول)

---

## البنية التقنية

### مكتبات جديدة
- @react-three/fiber
- @react-three/drei
- three
- gsap

### ملفات جديدة
```
/app/frontend/src/config/assets.js
/app/frontend/src/components/landing/
├── LandingPage3D.js
├── HeroSection3D.js
├── ServicesSection3D.js
├── PartnersSection3D.js
├── TrustSection3D.js
├── PaymentsSection3D.js
├── Header3D.js
└── Footer3D.js
```

---

آخر تحديث: ديسمبر 2025
