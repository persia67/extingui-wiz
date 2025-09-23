# ساخت برنامه دسکتاپ برای ویندوز

## مراحل ساخت فایل نصبی ویندوز:

### 1. آماده‌سازی پروژه
```bash
# نصب وابستگی‌ها
npm install

# ساخت پروژه وب
npm run build
```

### 2. اضافه کردن پلتفرم Electron
```bash
# اضافه کردن Electron
npx cap add electron

# به‌روزرسانی پلتفرم
npx cap sync electron
```

### 3. ساخت فایل نصبی
```bash
# رفتن به پوشه electron
cd electron

# نصب وابستگی‌های electron
npm install

# ساخت فایل exe برای ویندوز
npm run electron:pack

# یا برای ساخت installer:
npm run electron:make
```

### 4. یافتن فایل نصبی
فایل `.exe` یا `.msi` ساخته شده در پوشه `electron/dist` قرار دارد.

## نکات مهم:
- حتماً ابتدا `npm run build` را اجرا کنید
- برای ویندوز، از سیستم عامل ویندوز استفاده کنید
- فایل نصبی حدود 100-150 مگابایت خواهد بود

## اجرای محلی برای تست:
```bash
npx cap run electron
```