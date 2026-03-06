# 📋 دليل تشغيل مشروع شركة دبي العالمية للصرافة
## Dubai International Exchange — Project Info

---

## 🏗️ هيكل المشروع

```
iraq/
├── backend/         # خادم FastAPI (Python)
│   ├── server.py    # نقطة الدخول الرئيسية
│   ├── .env         # متغيرات البيئة
│   ├── routes/      # مسارات API
│   │   ├── auth.py       # المصادقة وإدارة المستخدمين
│   │   ├── orders.py     # إدارة الحوالات
│   │   ├── cms.py        # إدارة المحتوى والخدمات
│   │   ├── rates.py      # أسعار الصرف
│   │   ├── pdf.py        # توليد PDF
│   │   ├── blocklist.py  # قائمة الحظر
│   │   └── stamps.py     # الأختام والشعارات
│   ├── models/      # نماذج البيانات
│   ├── services/    # الخدمات المساعدة
│   └── requirements.txt
├── frontend/        # واجهة React
│   ├── src/
│   ├── .env
│   └── package.json
└── PROJECT_INFO.md  # هذا الملف
```

---

## 🚀 كيفية تشغيل المشروع

### 1️⃣ تشغيل الخادم الخلفي (Backend)

```bash
# الانتقال إلى مجلد الخادم
cd backend

# تثبيت المتطلبات (أول مرة فقط)
pip install -r requirements.txt

# تشغيل الخادم
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

✅ الخادم يعمل على: **http://localhost:8000**

---

### 2️⃣ تشغيل الواجهة الأمامية (Frontend)

```bash
# الانتقال إلى مجلد الواجهة
cd frontend

# تثبيت الحزم (أول مرة فقط)
yarn install
# أو
npm install

# تشغيل الواجهة
yarn start
# أو
npm start
```

✅ الواجهة تعمل على: **http://localhost:3000**

---

## 🔗 روابط مهمة

| الصفحة | الرابط |
|--------|--------|
| 🌐 الموقع الرئيسي | http://localhost:3000 |
| 🔧 لوحة التحكم (Admin) | http://localhost:3000/admin |
| 📡 API الخادم | http://localhost:8000/api |
| 📖 توثيق API (Swagger) | http://localhost:8000/docs |
| 📖 توثيق API (ReDoc) | http://localhost:8000/redoc |

---

## 🔐 بيانات الدخول

### 👨‍💻 حساب المطور (Developer) — صلاحيات كاملة

| الحقل | القيمة |
|-------|--------|
| البريد الإلكتروني | `developer@dubai-exchange.com` |
| كلمة المرور | `dev@123456` |
| الدور | `developer` (صلاحيات كاملة) |

> ⚠️ **تنبيه:** حساب المطور يملك صلاحيات كاملة على النظام ولا يمكن حذفه.  
> يُنصح بتغيير كلمة المرور بعد النشر على الإنترنت.

---

## 🛢️ قاعدة البيانات (MongoDB)

| الإعداد | القيمة |
|---------|--------|
| نوع قاعدة البيانات | MongoDB Atlas (Cloud) |
| رابط الاتصال | `mongodb+srv://admin:admin123@cluster0.er1qpfy.mongodb.net/` |
| اسم قاعدة البيانات | `khair_baghdad` |
| اسم المستخدم | `admin` |
| كلمة مرور MongoDB | `admin123` |

### المجموعات الرئيسية (Collections):
- `users` — المستخدمون والمدراء
- `orders` — الحوالات والطلبات
- `settings` — إعدادات الشركة وأسعار الصرف

---

## ⚙️ متغيرات البيئة

### `backend/.env`
```env
MONGO_URL=mongodb+srv://admin:admin123@cluster0.er1qpfy.mongodb.net/?appName=Cluster0
DB_NAME=khair_baghdad
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=votre_secret_tres_securise_123456789
```

### `frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 🏢 معلومات الشركة الافتراضية

| الحقل | القيمة |
|-------|--------|
| الاسم (عربي) | شركة دبي العالمية للصرافة |
| الاسم (إنجليزي) | Dubai International for Exchange |
| الاسم (كردي) | دوبەی نێودەوڵەتی بۆ گۆڕینەوە |
| البريد الإلكتروني | info@dubai-exchange.com |
| العنوان | بغداد، العراق |

---

## 🔌 API الرئيسية

| المسار | الوصف |
|--------|-------|
| `POST /api/auth/login` | تسجيل الدخول |
| `GET /api/auth/me` | بيانات المستخدم الحالي |
| `GET /api/orders` | قائمة الحوالات |
| `POST /api/orders` | إنشاء حوالة جديدة |
| `GET /api/settings/company` | إعدادات الشركة |
| `PUT /api/settings/company` | تحديث إعدادات الشركة |
| `GET /api/settings/exchange-rates` | أسعار الصرف |
| `PUT /api/settings/exchange-rates` | تحديث أسعار الصرف |
| `POST /api/convert` | تحويل العملات |
| `GET /api/auth/users` | قائمة المستخدمين (مطور فقط) |
| `POST /api/auth/users` | إضافة مستخدم جديد (مطور فقط) |

---

## 🛠️ التقنيات المستخدمة

### الخادم الخلفي:
- **Python / FastAPI** — إطار عمل الخادم
- **MongoDB / Motor** — قاعدة البيانات اللاتزامنية
- **JWT / Jose** — المصادقة بالرmoز
- **Passlib / bcrypt** — تشفير كلمات المرور
- **ReportLab** — توليد ملفات PDF
- **Uvicorn** — خادم ASGI

### الواجهة الأمامية:
- **React 19** — إطار عمل الواجهة
- **TailwindCSS** — التنسيق
- **Radix UI** — مكونات UI
- **Framer Motion / GSAP** — الحركات والتأثيرات
- **React Router v7** — التنقل بين الصفحات
- **i18next** — دعم تعدد اللغات (عربي / إنجليزي / كردي)
- **Recharts** — الرسوم البيانية
- **Axios** — طلبات HTTP

---

## 📝 ملاحظات التشغيل

1. **الاتصال بالإنترنت مطلوب** — قاعدة البيانات على MongoDB Atlas السحابية
2. **Python 3.9+** مطلوب لتشغيل الخادم
3. **Node.js 18+** مطلوب لتشغيل الواجهة
4. **Yarn** هو مدير الحزم المفضل للواجهة
5. عند تشغيل المشروع لأول مرة، يتم إنشاء حساب المطور تلقائياً
6. يتم تهيئة البيانات الافتراضية (الخدمات، الدول، الأسعار) تلقائياً عند الإقلاع

---

## 🔄 إعادة تعيين كلمة مرور المطور

إذا نسيت كلمة المرور، يمكنك حذف حساب المطور من قاعدة البيانات  
وعند إعادة تشغيل الخادم سيتم إنشاؤه تلقائياً بكلمة المرور الافتراضية `dev@123456`.

```javascript
// في MongoDB Compass أو Atlas:
db.users.deleteOne({ role: "developer" })
```

---

*آخر تحديث: فبراير 2026*
