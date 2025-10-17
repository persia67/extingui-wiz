# 🔥 سیستم مدیریت کپسول‌های اطفاء حریق
## Fire Extinguisher Management System

[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-green)](https://supabase.com)

یک سیستم جامع برای مدیریت، پیگیری و ارزیابی کپسول‌های اطفاء حریق با قابلیت‌های هوش مصنوعی.

**URL پروژه**: https://lovable.dev/projects/d32bc395-4e62-4c14-a312-7a92b2af9751

---

## 🌟 ویژگی‌ها

- ✅ **مدیریت کامل کپسول‌ها**: ثبت، ویرایش، حذف و پیگیری وضعیت
- 📊 **داشبورد تحلیلی**: نمایش آمار و وضعیت کلی
- 🔍 **جستجو و فیلتر پیشرفته**: یافتن سریع کپسول‌ها
- 📥 **Import/Export Excel**: دریافت و ارسال داده‌ها
- 🤖 **ارزیابی ریسک هوشمند**: ارزیابی خودکار ریسک حریق با AI
- 💬 **مشاور هوشمند**: چت‌بات AI برای مشاوره ایمنی
- 🔐 **احراز هویت امن**: سیستم کاربری با نقش‌های مختلف
- 🌓 **حالت تاریک/روشن**: پشتیبانی از Dark/Light Mode
- 🌐 **دو زبانه**: فارسی و انگلیسی
- 📱 **Responsive**: سازگار با موبایل، تبلت و دسکتاپ

---

## 📱 نسخه‌های موبایل و دسکتاپ

این پروژه قابلیت تبدیل به اپلیکیشن Native دارد:

### 🖥️ نسخه Desktop (Windows EXE)
راهنمای کامل ساخت فایل EXE:
👉 **[BUILD_DESKTOP.md](BUILD_DESKTOP.md)**

### 📱 نسخه Android (APK)
راهنمای کامل ساخت فایل APK:
👉 **[BUILD_ANDROID.md](BUILD_ANDROID.md)**

### 📚 راهنمای جامع
راهنمای کامل برای هر دو پلتفرم:
👉 **[BUILD_GUIDE_FA.md](BUILD_GUIDE_FA.md)**

---

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d32bc395-4e62-4c14-a312-7a92b2af9751) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ تکنولوژی‌های استفاده شده

### Frontend:
- **React 18.3** - کتابخانه UI
- **TypeScript** - زبان برنامه‌نویسی
- **Vite** - Build Tool سریع
- **Tailwind CSS** - فریمورک CSS
- **shadcn/ui** - کامپوننت‌های UI
- **React Router** - مدیریت مسیرها
- **TanStack Query** - مدیریت State سمت سرور

### Backend:
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions
  - Real-time Subscriptions

### AI:
- **Lovable AI Gateway** - دسترسی به مدل‌های AI
  - Google Gemini 2.5 Flash
  - ارزیابی ریسک حریق
  - چت‌بات مشاور ایمنی

### Desktop & Mobile:
- **Capacitor** - فریمورک Native
  - Android (APK)
  - Electron (Windows EXE)

## 🚀 دیپلوی پروژه

### دیپلوی وب:
1. باز کردن [پروژه در Lovable](https://lovable.dev/projects/d32bc395-4e62-4c14-a312-7a92b2af9751)
2. کلیک روی **Share → Publish**
3. پروژه شما به صورت آنلاین منتشر می‌شود

### اتصال دامنه سفارشی:
- رفتن به **Project > Settings > Domains**
- کلیک روی **Connect Domain**
- [اطلاعات بیشتر درباره دامنه سفارشی](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 📦 نصب و اجرا (Development)

### پیش‌نیازها:
- Node.js 18+ ([دانلود](https://nodejs.org/))
- npm یا yarn
- Git

### مراحل نصب:

```bash
# 1. Clone کردن پروژه
git clone <YOUR_GIT_URL>
cd extingui-wiz

# 2. نصب وابستگی‌ها
npm install

# 3. تنظیم متغیرهای محیطی
# فایل .env از قبل تنظیم شده است

# 4. اجرای پروژه در حالت Development
npm run dev

# 5. باز کردن در مرورگر
# http://localhost:8080
```

### دستورات مفید:

```bash
# Build پروژه برای Production
npm run build

# Preview نسخه Production
npm run preview

# بررسی کدها (Lint)
npm run lint

# فرمت کدها
npm run format
```

---

## 🗄️ ساختار پروژه

```
extingui-wiz/
├── src/
│   ├── components/        # کامپوننت‌های React
│   │   ├── ui/           # کامپوننت‌های پایه (shadcn)
│   │   ├── Dashboard.tsx
│   │   ├── ExtinguisherTable.tsx
│   │   ├── RiskAssessment.tsx
│   │   └── FireSafetyChat.tsx
│   ├── contexts/         # Context های React
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/            # Custom Hooks
│   ├── integrations/     # Supabase Integration
│   │   └── supabase/
│   ├── locales/          # فایل‌های ترجمه
│   ├── pages/            # صفحات اصلی
│   ├── utils/            # توابع کمکی
│   ├── App.tsx           # کامپوننت اصلی
│   └── main.tsx          # Entry Point
├── supabase/
│   ├── functions/        # Edge Functions
│   │   ├── assess-fire-risk/
│   │   └── fire-safety-chat/
│   ├── migrations/       # Database Migrations
│   └── config.toml       # تنظیمات Supabase
├── public/               # فایل‌های استاتیک
├── resources/            # آیکون‌ها برای Desktop
├── BUILD_DESKTOP.md      # راهنمای ساخت EXE
├── BUILD_ANDROID.md      # راهنمای ساخت APK
├── BUILD_GUIDE_FA.md     # راهنمای جامع
└── capacitor.config.ts   # تنظیمات Capacitor
```

---

## 🔐 احراز هویت و نقش‌ها

### نقش‌های کاربری:
- **Admin**: دسترسی کامل به تمام بخش‌ها
- **Viewer**: مشاهده اطلاعات (بدون دسترسی ویرایش)

### ویژگی‌های Admin:
- ✅ افزودن/ویرایش/حذف کپسول
- ✅ Import/Export Excel
- ✅ دسترسی به ارزیابی ریسک AI
- ✅ مدیریت کاربران

---

## 🤖 قابلیت‌های هوش مصنوعی

### 1. ارزیابی ریسک حریق
با وارد کردن اطلاعات محیط کار (نوع صنعت، مساحت، تجهیزات)، سیستم:
- سطح ریسک را ارزیابی می‌کند (کم/متوسط/بالا)
- تجهیزات مورد نیاز را پیشنهاد می‌دهد
- تعداد و محل نصب را مشخص می‌کند
- بر اساس استانداردهای NFPA و ملی ایران

### 2. مشاور هوشمند
چت‌بات تخصصی برای:
- پاسخ به سوالات ایمنی
- راهنمایی درباره انواع کپسول‌ها
- توصیه‌های فنی و استانداردها
- آموزش و راهنمایی کاربران

---

## 📊 Database Schema

### جداول اصلی:

**extinguishers** - اطلاعات کپسول‌ها
```sql
- id (UUID)
- code (TEXT) - کد کپسول
- type (TEXT) - نوع کپسول
- capacity (TEXT) - ظرفیت
- location (TEXT) - محل نصب
- last_inspection (DATE) - آخرین بازرسی
- expire_date (DATE) - تاریخ انقضا
- status (TEXT) - وضعیت
- user_id (UUID) - شناسه کاربر
```

**profiles** - اطلاعات کاربران
```sql
- id (UUID)
- email (TEXT)
- full_name (TEXT)
- created_at (TIMESTAMP)
```

**user_roles** - نقش‌های کاربری
```sql
- id (UUID)
- user_id (UUID)
- role (app_role ENUM) - admin/viewer
```

---

## 🔒 امنیت

- ✅ Row Level Security (RLS) فعال
- ✅ احراز هویت Supabase
- ✅ مدیریت امن نقش‌ها
- ✅ API Keys در متغیرهای محیطی
- ✅ HTTPS برای تمام ارتباطات

---

## 📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 👥 تیم توسعه

ساخته شده با ❤️ توسط تیم Lovable

- **Lovable Platform**: [lovable.dev](https://lovable.dev)
- **پشتیبانی**: support@lovable.dev

---

## 🐛 گزارش باگ و پیشنهادات

برای گزارش باگ یا ارسال پیشنهاد:
1. ایجاد Issue در GitHub
2. ارسال ایمیل به تیم پشتیبانی
3. استفاده از چت Lovable

---

## 📚 منابع مفید

- [Lovable Docs](https://docs.lovable.dev)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Capacitor Docs](https://capacitorjs.com/docs)

---

**🔥 موفق باشید!**
