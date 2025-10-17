# 📱 Android Build - دستورالعمل گام به گام

## ⚡ دستورات سریع (Quick Commands)

```bash
# 1. نصب و build
npm install
npm run build

# 2. اضافه کردن Android (فقط بار اول)
npx cap add android

# 3. همگام‌سازی
npx cap sync android

# 4. باز کردن در Android Studio
npx cap open android

# 5. در Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

---

## 📋 پیش‌نیازها

### 1. نصب Android Studio
1. دانلود از: https://developer.android.com/studio
2. نصب کامل Android Studio
3. باز کردن Android Studio → More Actions → SDK Manager
4. نصب:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK (حداقل API 24)

### 2. تنظیم متغیرهای محیطی (Windows)

**راه اول: از طریق GUI**
1. کلیک راست روی "This PC" → Properties
2. Advanced system settings → Environment Variables
3. در User variables، کلیک New:
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\[نام-شما]\AppData\Local\Android\Sdk`
4. ویرایش Path و اضافه کردن:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`

**راه دوم: از طریق PowerShell (Run as Administrator)**
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "User")
$path = [System.Environment]::GetEnvironmentVariable("Path", "User")
[System.Environment]::SetEnvironmentVariable("Path", "$path;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools", "User")
```

### 3. بررسی نصب
باز کردن CMD یا PowerShell جدید:
```bash
adb --version
# باید نسخه ADB را نمایش دهد
```

---

## 🚀 مراحل ساخت APK

### مرحله 1: آماده‌سازی پروژه
```bash
# 1. Clone از GitHub
git clone [repository-url]
cd extingui-wiz

# 2. نصب وابستگی‌ها
npm install

# 3. Build پروژه
npm run build
```

### مرحله 2: اضافه کردن Android (فقط بار اول)
```bash
# اضافه کردن پلتفرم Android
npx cap add android

# به‌روزرسانی وابستگی‌ها
npx cap update android
```

### مرحله 3: تنظیم فایل‌های Android

**ایجاد `android/local.properties`:**
```properties
sdk.dir=C:\\Users\\[نام-شما]\\AppData\\Local\\Android\\Sdk
```

**ویرایش `android/app/build.gradle` (اختیاری):**
```gradle
android {
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### مرحله 4: همگام‌سازی
```bash
# همگام‌سازی کد وب با Android
npx cap sync android
```

### مرحله 5: باز کردن در Android Studio
```bash
npx cap open android
```

### مرحله 6: ساخت APK

**در Android Studio:**

1. **برای تست (Debug APK):**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - منتظر بمانید تا Build تمام شود
   - Locate روی notification
   - فایل: `android/app/build/outputs/apk/debug/app-debug.apk`

2. **برای انتشار (Release APK):**
   - Build → Generate Signed Bundle / APK
   - انتخاب APK → Next
   - Create new keystore یا انتخاب keystore موجود
   - پر کردن اطلاعات keystore
   - انتخاب release build variant
   - Finish

---

## 🔐 ساخت Keystore برای Release

### ایجاد Keystore جدید:
```bash
keytool -genkey -v -keystore extingui-wiz-release.keystore -alias extingui-wiz -keyalg RSA -keysize 2048 -validity 10000
```

**اطلاعات مورد نیاز:**
- Password: [رمز قوی]
- First and last name: [نام شما]
- Organizational unit: [شرکت/سازمان]
- Organization: [نام سازمان]
- City: [شهر]
- State: [استان]
- Country code: IR

**⚠️ مهم:** فایل keystore و password را در جای امن نگه دارید!

### استفاده از Keystore در Android Studio:
1. Build → Generate Signed Bundle / APK
2. انتخاب APK
3. Choose existing: انتخاب فایل `.keystore`
4. وارد کردن:
   - Key store password
   - Key alias: extingui-wiz
   - Key password
5. Next → Release → Finish

---

## 🔧 عیب‌یابی

### خطای "ANDROID_HOME not found"
```bash
# بررسی
echo %ANDROID_HOME%

# تنظیم مجدد (PowerShell as Admin)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "User")

# باز کردن ترمینال جدید و تست
adb --version
```

### خطای "SDK location not found"
ایجاد `android/local.properties`:
```properties
sdk.dir=C:\\Users\\[USER]\\AppData\\Local\\Android\\Sdk
```

### خطای Gradle Build Failed
```bash
cd android
gradlew clean
cd ..
npx cap sync android
npx cap open android
```

### خطای "Execution failed for task ':app:mergeDebugResources'"
```bash
cd android
gradlew clean
gradlew build --stacktrace
```

### خطای Java Version
```bash
# بررسی نسخه Java
java -version

# باید Java 17 باشد
# در صورت نیاز، دانلود JDK 17 از:
# https://www.oracle.com/java/technologies/downloads/
```

---

## 📦 تست APK روی دستگاه

### روش 1: نصب مستقیم از Android Studio
1. وصل کردن گوشی با USB
2. فعال کردن Developer Mode و USB Debugging روی گوشی
3. Run → Run 'app'

### روش 2: نصب دستی APK
1. کپی `app-debug.apk` به گوشی
2. باز کردن File Manager
3. کلیک روی فایل APK
4. تایید نصب (ممکن است نیاز به تنظیم "Install from unknown sources" باشد)

### روش 3: استفاده از ADB
```bash
# وصل کردن گوشی و اجرای:
adb devices
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## ✅ چک‌لیست قبل از انتشار

- [ ] تست روی حداقل 3 دستگاه مختلف
- [ ] تست در Android 7, 10, 13
- [ ] بررسی مجوزها (Permissions)
- [ ] تست اتصال به Supabase
- [ ] تست آفلاین (در صورت وجود)
- [ ] بررسی حجم APK (کمتر از 100MB)
- [ ] ساخت APK امضا شده با keystore
- [ ] تست نصب و حذف
- [ ] بررسی آیکون و نام برنامه
- [ ] تست در حالت Portrait و Landscape

---

## 📊 اطلاعات APK

- **Package Name:** `app.lovable.d32bc3954e624c14a3127a92b2af9751`
- **App Name:** extingui-wiz
- **Min SDK:** Android 7.0 (API 24)
- **Target SDK:** Android 14 (API 34)
- **Permissions:** INTERNET, NETWORK_STATE

---

## 🚀 به‌روزرسانی APK

برای build جدید بعد از تغییرات:

```bash
# 1. Pull آخرین تغییرات از GitHub
git pull

# 2. نصب وابستگی‌های جدید (در صورت وجود)
npm install

# 3. Build جدید
npm run build

# 4. Sync با Android
npx cap sync android

# 5. باز کردن در Android Studio
npx cap open android

# 6. Build APK جدید
```

**نکته:** هر بار که تغییرات جدیدی در کد می‌دهید، باید مراحل 3-6 را تکرار کنید.

---

## 📱 انتشار در Google Play Store

1. ایجاد حساب Google Play Developer ($25 یکبار)
2. ساخت Release APK امضا شده
3. آپلود APK در Google Play Console
4. تکمیل اطلاعات برنامه:
   - عنوان و توضیحات
   - اسکرین‌شات‌ها
   - آیکون
   - دسته‌بندی
5. ثبت برای بررسی

---

**موفق باشید! 🎉**
