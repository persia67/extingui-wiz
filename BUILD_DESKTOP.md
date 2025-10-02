# ساخت برنامه دسکتاپ (ویندوز، مک، لینوکس)

## مراحل ساخت برنامه دسکتاپ:

### 1. آماده‌سازی پروژه
```bash
# نصب وابستگی‌ها
npm install

# ساخت پروژه وب
npm run build
```

### 2. اضافه کردن پلتفرم Electron (فقط بار اول)
```bash
# اضافه کردن Electron
npx cap add electron
```

### 3. همگام‌سازی و ساخت
```bash
# همگام‌سازی فایل‌های وب با Electron
npx cap sync electron

# رفتن به پوشه electron
cd electron

# نصب وابستگی‌های electron (در صورت نیاز)
npm install

# ساخت برنامه برای سیستم‌عامل جاری
npm run build

# یا برای ساخت فایل نصبی:
npm run make
```

### 4. یافتن فایل نصبی
فایل‌های ساخته شده در پوشه `electron/out` قرار دارند:
- **ویندوز**: فایل `.exe` یا نصب کننده `.msi`
- **مک**: فایل `.app` یا `.dmg`
- **لینوکس**: فایل `.deb` یا `.AppImage`

## اجرای محلی برای تست:
```bash
# اجرا از ریشه پروژه
npx cap run electron

# یا از داخل پوشه electron
cd electron
npm start
```

## نکات مهم:
- حتماً قبل از sync کردن، `npm run build` را اجرا کنید
- برای هر سیستم‌عامل، بهتر است روی همان سیستم build بگیرید
- حجم فایل نصبی بین 80-150 مگابایت است
- فایل `electron.config.json` تنظیمات ساخت را مشخص می‌کند

## عیب‌یابی:
اگر با خطا مواجه شدید:
1. پوشه `node_modules` و `electron/node_modules` را حذف کنید
2. `npm install` را دوباره اجرا کنید
3. مطمئن شوید که `dist` پوشه از `npm run build` وجود دارد