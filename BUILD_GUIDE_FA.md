# 🔥 راهنمای کامل ساخت نسخه Desktop و Android

## 📋 پیش‌نیازها

### برای Windows Desktop (.exe):
- Node.js نسخه 18 یا بالاتر
- Git
- ویندوز 10 یا بالاتر

### برای Android (.apk):
- Node.js نسخه 18 یا بالاتر
- Git
- Android Studio (دانلود از: https://developer.android.com/studio)
- Java Development Kit (JDK) 17

---

## 🖥️ ساخت نسخه Desktop (Windows EXE)

### مرحله 1: آماده‌سازی پروژه
```bash
# کپی پروژه از GitHub
git clone [آدرس-ریپازیتوری-شما]
cd extingui-wiz

# نصب وابستگی‌ها
npm install

# ساخت نسخه Production
npm run build
```

### مرحله 2: اضافه کردن Electron (فقط بار اول)
```bash
# اضافه کردن پلتفرم Electron
npx cap add electron
```

### مرحله 3: همگام‌سازی و ساخت
```bash
# همگام‌سازی فایل‌ها
npx cap sync electron

# رفتن به پوشه electron
cd electron

# نصب وابستگی‌های Electron
npm install

# نصب ابزارهای ساخت Electron
npm install --save-dev @electron-forge/cli @electron-forge/maker-squirrel @electron-forge/maker-zip @electron-forge/maker-deb
```

### مرحله 4: تنظیم Electron Forge
در پوشه `electron`، فایل `package.json` را ویرایش کنید و این بخش را اضافه کنید:

```json
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "make": "electron-forge make"
  },
  "config": {
    "forge": "../electron.config.json"
  }
}
```

### مرحله 5: ساخت فایل EXE
```bash
# ساخت فایل نصبی
npm run make
```

📦 **فایل EXE شما در مسیر**: `electron/out/make/squirrel.windows/x64/`

---

## 📱 ساخت نسخه Android (APK)

### مرحله 1: آماده‌سازی پروژه
```bash
# کپی پروژه از GitHub (اگر قبلاً انجام ندادید)
git clone [آدرس-ریپازیتوری-شما]
cd extingui-wiz

# نصب وابستگی‌ها
npm install

# ساخت نسخه Production
npm run build
```

### مرحله 2: نصب و تنظیم Android Studio
1. دانلود و نصب Android Studio از https://developer.android.com/studio
2. باز کردن Android Studio و نصب SDK Tools:
   - Tools → SDK Manager → SDK Tools
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android Emulator (اختیاری برای تست)

3. تنظیم متغیرهای محیطی (Environment Variables):

**Windows:**
```
ANDROID_HOME = C:\Users\[نام-کاربری]\AppData\Local\Android\Sdk
Path += %ANDROID_HOME%\platform-tools
Path += %ANDROID_HOME%\tools
```

**بررسی نصب:**
```bash
# باز کردن ترمینال جدید و اجرای:
adb --version
```

### مرحله 3: اضافه کردن پلتفرم Android
```bash
# اضافه کردن Android (فقط بار اول)
npx cap add android

# به‌روزرسانی وابستگی‌های Android
npx cap update android
```

### مرحله 4: همگام‌سازی
```bash
# همگام‌سازی فایل‌ها با Android
npx cap sync android
```

### مرحله 5: باز کردن در Android Studio
```bash
# باز کردن پروژه در Android Studio
npx cap open android
```

### مرحله 6: ساخت APK از Android Studio

1. در Android Studio، از منو:
   - **Build → Build Bundle(s) / APK(s) → Build APK(s)**

2. منتظر بمانید تا Build تمام شود (چند دقیقه طول می‌کشد)

3. بعد از تمام شدن، پیام "APK(s) generated successfully" نمایش داده می‌شود

4. کلیک روی **locate** برای یافتن فایل APK

📦 **فایل APK شما در مسیر**: `android/app/build/outputs/apk/debug/app-debug.apk`

### مرحله 7: ساخت APK امضا شده (برای انتشار)

برای انتشار در Google Play، باید APK امضا شده بسازید:

1. ایجاد Keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. در Android Studio:
   - **Build → Generate Signed Bundle / APK**
   - انتخاب APK
   - انتخاب یا ایجاد Keystore
   - انتخاب Build Variant: **release**

📦 **APK امضا شده**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔧 عیب‌یابی مشکلات رایج

### مشکل 1: خطای "ANDROID_HOME not found"
**راه‌حل:**
```bash
# ویندوز - اجرا در PowerShell به عنوان Administrator:
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\[نام-کاربری]\AppData\Local\Android\Sdk", "User")

# باز کردن مجدد ترمینال
```

### مشکل 2: خطای Gradle Build Failed
**راه‌حل:**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### مشکل 3: خطای "SDK location not found"
**راه‌حل:**
ایجاد فایل `android/local.properties`:
```
sdk.dir=C:\\Users\\[نام-کاربری]\\AppData\\Local\\Android\\Sdk
```

### مشکل 4: Electron Build Failed
**راه‌حل:**
```bash
# حذف و نصب مجدد
cd electron
rm -rf node_modules
npm install
cd ..
rm -rf node_modules  
npm install
npm run build
npx cap sync electron
```

---

## 📝 نکات مهم

### برای Desktop:
- ✅ حجم فایل: 80-150 مگابایت
- ✅ سازگاری: Windows 10 به بالا
- ✅ نیاز به نصب: بله (فقط بار اول)
- ✅ بروزرسانی: خودکار یا manual

### برای Android:
- ✅ حجم فایل: 15-30 مگابایت
- ✅ حداقل Android: 7.0 (API 24)
- ✅ مجوزها: اینترنت، ذخیره‌سازی
- ✅ دسترسی به Supabase: نیاز به اینترنت

### برای هر دو:
- ⚠️ قبل از هر build، حتماً `npm run build` بزنید
- ⚠️ همیشه از آخرین نسخه کد در GitHub استفاده کنید
- ⚠️ تست کامل روی دستگاه واقعی انجام دهید
- ⚠️ برای انتشار، APK امضا شده بسازید

---

## 🚀 دستورات سریع

### Build سریع Desktop:
```bash
npm install && npm run build && npx cap sync electron && cd electron && npm run make
```

### Build سریع Android:
```bash
npm install && npm run build && npx cap sync android && npx cap open android
```

---

## 📞 پشتیبانی

اگر با مشکل مواجه شدید:
1. پوشه‌های `node_modules` را حذف و دوباره `npm install` کنید
2. Cache را پاک کنید: `npm cache clean --force`
3. نسخه Node.js خود را بررسی کنید: `node --version` (باید 18+ باشد)
4. مستندات Capacitor: https://capacitorjs.com/docs

---

## ✅ چک‌لیست قبل از انتشار

### Desktop:
- [ ] تست روی Windows 10 و 11
- [ ] تست نصب و حذف
- [ ] تست اتصال به Supabase
- [ ] تست عملکرد آفلاین (در صورت وجود)
- [ ] بررسی آیکون و نام برنامه

### Android:
- [ ] تست روی حداقل 3 دستگاه مختلف
- [ ] تست در Android 7 تا 14
- [ ] بررسی مجوزهای لازم
- [ ] تست اتصال به Supabase
- [ ] ساخت APK امضا شده
- [ ] بررسی حجم فایل (باید کمتر از 100MB باشد)

---

**موفق باشید! 🎉**
