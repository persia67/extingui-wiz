# 🖥️ Desktop Build - دستورالعمل گام به گام (Windows EXE)

## ⚡ دستورات سریع (Quick Commands)

```bash
# 1. نصب و build
npm install
npm run build

# 2. اضافه کردن Electron (فقط بار اول)
npx cap add electron

# 3. همگام‌سازی
npx cap sync electron

# 4. رفتن به پوشه electron و نصب
cd electron
npm install

# 5. نصب Electron Forge (فقط بار اول)
npm install --save-dev @electron-forge/cli @electron-forge/maker-squirrel

# 6. ساخت فایل EXE
npm run make
```

**📦 فایل EXE در:** `electron/out/make/squirrel.windows/x64/`

---

## 📋 پیش‌نیازها

### برای Windows:
- Node.js نسخه 18 یا بالاتر ([دانلود](https://nodejs.org/))
- Git ([دانلود](https://git-scm.com/))
- Windows 10 یا بالاتر
- حداقل 2GB فضای خالی

### بررسی نصب:
```bash
node --version    # باید v18.0.0 یا بالاتر باشد
npm --version     # باید 9.0.0 یا بالاتر باشد
git --version
```

---

## 🚀 مراحل ساخت EXE

### مرحله 1: آماده‌سازی پروژه
```bash
# 1. Clone از GitHub
git clone [repository-url]
cd extingui-wiz

# 2. نصب وابستگی‌ها
npm install

# 3. Build پروژه وب
npm run build
```

### مرحله 2: اضافه کردن Electron (فقط بار اول)
```bash
# اضافه کردن پلتفرم Electron
npx cap add electron
```

این دستور پوشه `electron` را ایجاد می‌کند با تمام فایل‌های لازم.

### مرحله 3: تنظیم Electron

```bash
# رفتن به پوشه electron
cd electron

# نصب وابستگی‌ها
npm install

# نصب Electron Forge (برای ساخت EXE)
npm install --save-dev @electron-forge/cli
npm install --save-dev @electron-forge/maker-squirrel
npm install --save-dev @electron-forge/maker-zip
```

### مرحله 4: تنظیم package.json

در فایل `electron/package.json` مطمئن شوید که این بخش‌ها وجود دارند:

```json
{
  "name": "extingui-wiz",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "electron .",
    "make": "electron-forge make"
  },
  "config": {
    "forge": "../electron.config.json"
  }
}
```

### مرحله 5: همگام‌سازی
```bash
# بازگشت به ریشه پروژه
cd ..

# همگام‌سازی فایل‌های وب با Electron
npx cap sync electron
```

### مرحله 6: تست محلی (اختیاری)
```bash
# اجرا برای تست
npx cap run electron

# یا
cd electron
npm start
```

### مرحله 7: ساخت فایل EXE
```bash
cd electron
npm run make
```

**منتظر بمانید...** این فرآیند ممکن است 5-10 دقیقه طول بکشد.

### مرحله 8: یافتن فایل EXE

بعد از تمام شدن، فایل EXE در این مسیر است:
```
electron/out/make/squirrel.windows/x64/
```

فایل‌ها:
- `extingui-wiz-1.0.0 Setup.exe` - نصب کننده (Installer)
- `extingui-wiz.exe` - فایل اجرایی اصلی

---

## 🔧 عیب‌یابی

### خطای "electron-forge not found"
```bash
cd electron
npm install --save-dev @electron-forge/cli @electron-forge/maker-squirrel
```

### خطای "Cannot find module"
```bash
# حذف تمام node_modules
cd electron
rm -rf node_modules
cd ..
rm -rf node_modules

# نصب مجدد
npm install
cd electron
npm install
```

### خطای "Build failed"
```bash
# پاک کردن cache
npm cache clean --force

# Build مجدد
cd ..
npm run build
npx cap sync electron
cd electron
npm run make
```

### خطای "Out of memory"
```bash
# افزایش حافظه Node.js
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run make
```

### فایل dist وجود ندارد
```bash
# مطمئن شوید از ریشه پروژه build بگیرید
cd ..
npm run build
ls dist/  # باید فایل‌ها را نشان دهد
```

---

## 📦 ویژگی‌های فایل EXE

- **نام برنامه:** سیستم مدیریت کپسول‌های اطفاء حریق
- **نام فایل:** extingui-wiz.exe
- **حجم:** تقریباً 80-150 مگابایت
- **سیستم‌عامل:** Windows 10, 11 (64-bit)
- **نیاز به نصب:** بله (فقط بار اول)
- **آیکون:** از `resources/icon.ico` استفاده می‌شود

---

## 🎨 سفارشی‌سازی آیکون

برای تغییر آیکون برنامه:

1. ایجاد فایل `.ico` با سایز 256x256
2. جایگزینی در `resources/icon.ico`
3. Build مجدد:
```bash
npm run build
npx cap sync electron
cd electron
npm run make
```

---

## 📝 نکات مهم

- ✅ **همیشه** قبل از `npx cap sync electron` دستور `npm run build` را بزنید
- ✅ فایل EXE شامل تمام وابستگی‌ها است (self-contained)
- ✅ کاربران نیازی به نصب Node.js ندارند
- ✅ برنامه بدون اینترنت هم کار می‌کند (اگر به Supabase متصل نباشد)
- ⚠️ برای build روی مک یا لینوکس، باید از همان سیستم‌عامل build بگیرید
- ⚠️ حجم بالا طبیعی است چون Electron شامل Chromium است

---

## 🔄 به‌روزرسانی برنامه

برای build جدید بعد از تغییرات:

```bash
# 1. Pull آخرین تغییرات
git pull

# 2. نصب وابستگی‌های جدید (در صورت وجود)
npm install

# 3. Build جدید
npm run build

# 4. Sync با Electron
npx cap sync electron

# 5. Build EXE جدید
cd electron
npm run make
```

---

## 📊 ساخت نسخه Portable (بدون نصب)

برای ساخت نسخه Portable که بدون نصب اجرا شود:

1. ویرایش `electron.config.json`:
```json
{
  "makers": [
    {
      "name": "@electron-forge/maker-zip",
      "platforms": ["win32"]
    }
  ]
}
```

2. Build:
```bash
cd electron
npm run make
```

فایل ZIP در `electron/out/make/zip/win32/` قرار دارد.

---

## ✅ چک‌لیست قبل از توزیع

- [ ] تست روی Windows 10
- [ ] تست روی Windows 11
- [ ] تست نصب و حذف
- [ ] بررسی آیکون و نام برنامه
- [ ] تست اتصال به Supabase
- [ ] تست عملکرد آفلاین (در صورت وجود)
- [ ] بررسی حجم فایل نهایی
- [ ] تست با آنتی‌ویروس‌های مختلف
- [ ] ایجاد فایل README برای کاربران

---

## 🚀 نصب برنامه برای کاربران

کاربران فقط باید:
1. دانلود `extingui-wiz-1.0.0 Setup.exe`
2. اجرای فایل
3. تایید نصب
4. برنامه در Start Menu اضافه می‌شود

---

**موفق باشید! 🎉**