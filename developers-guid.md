**راهنمای توسعه‌دهنده — absence-tracker**

- **هدف:** راه‌اندازی سریع پروژه، تست محلی و نکات عیب‌یابی برای مدیا (عکس/صوت) و navigation.

**محیط مورد نیاز**
- Node.js (v18+ توصیه می‌شود)
- npm یا yarn
- Expo CLI (غیرضروری، از `npx expo` هم استفاده می‌شود)

**گام‌های نصب و اجرای محلی**
- وارد پوشه اپ شوید:

```bash
cd app
```

- نصب وابستگی‌ها:

```bash
npm install
# یا
# yarn
```

- اجرای اپ (بدون تَنل/ngrok — سریع‌تر و قابل‌اعتماد در شبکه محلی):

```bash
npx expo start --web --lan --clear
# یا
# npm run start -- --web --lan --clear
```

- اگر می‌خواهید با tunnel (از راه دور) اجرا کنید، نیاز به بسته `@expo/ngrok` دارید یا نصب سراسری آن؛ اگر Expo از شما درخواست نصب ngrok کرد، می‌توانید آن را محلی نصب کنید:

```bash
cd app
npm install @expo/ngrok
```

**نکات مربوط به مدیا (عکس / صوت)**
- کتابخانه‌های استفاده‌شده: `expo-image-picker`, `expo-av` (نسخه‌های سازگار از طریق `npx expo install` اضافه شده‌اند).
- مجوزها در زمان اجرا از کاربر پرسیده می‌شود — گالری، دوربین و میکروفون.
- نمایش فعلی پیوست‌ها URI را نگه می‌دارد؛ می‌توان پیش‌نمایش تصویر و حذف پیوست را اضافه کرد.

**مشکلات رایج و راه‌حل‌ها**
- خطای MIME / 500 برای `index.ts.bundle`: معمولاً به‌خاطر خطا در Metro/Expo (سرور bundle) است — ابتدا cache را پاک و مجدداً اجرا کنید:

```bash
cd app
npx expo start --web --lan --clear
```

- خطا: `libatk-1.0.so.0: cannot open shared object file` هنگام اجرای Expo/Metro: نیاز به کتابخانه‌های سیستمی (GTK) است. در محیط لینوکس (نیاز به `sudo`) این بسته‌ها را نصب کنید:

```bash
sudo apt-get update
sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 libgdk-pixbuf2.0-0
```

- اگر Expo هنگام استفاده از tunnel می‌گوید `Install @expo/ngrok`، نصب محلی یا سراسری آن مشکل tunnel را حل می‌کند:

```bash
cd app
npm install @expo/ngrok
```

**تغییرات کلیدی کد (نقاط ورود برای بررسی سریع)**
- صفحات و منطق اصلی:
  - [app/src/screens/JournalScreen.tsx](app/src/screens/JournalScreen.tsx#L1)
  - [app/src/screens/EntryDetailScreen.tsx](app/src/screens/EntryDetailScreen.tsx#L1)
  - [app/src/navigation/AppNavigator.tsx](app/src/navigation/AppNavigator.tsx#L1)
- استور و انواع داده:
  - [app/src/store/memoryStore.ts](app/src/store/memoryStore.ts#L1)
  - [app/src/types/journal.ts](app/src/types/journal.ts#L1)
- وابستگی‌های جدید (در `app/package.json`):
  - `expo-image-picker`, `expo-av`, `@expo/ngrok` (در صورت نصب)

**تست دستی سریع ویژگی‌های افزوده‌شده**
1. اجرا کنید: `npx expo start --web --lan --clear`
2. به تب `Journal` بروید.
3. "یادآوری جدید" را اضافه کنید: متن، حالت روحی، سپس از دکمه‌های "گالری" یا "دوربین" عکس اضافه کنید.
4. ضبط صوت با "شروع ضبط" و "پایان ضبط" تست شود؛ سپس دکمه پخش برای فایل‌های صوتی موجود را بزنید.
5. تست ویرایش و حذف ورودی‌ها و فیلتر بر اساس مود (چیپ‌ها).

**پیشنهادهای بعدی**
- پیش‌نمایش inline تصویر در کارت ورودی و حذف پیوست‌ها از UI.  
- اضافه‌کردن ویجت زمان‌بندی/متر (progress) برای ضبط صوت.  
- پیاده‌سازی dark/light theme toggle در هدر و animated tab transitions (نیاز به `react-native-reanimated` و تنظیمات اضافی).

اگر بخواهید، می‌توانم همین حالا:
- A) پیش‌نمایش تصویر را اضافه کنم، یا
- B) حذف پیوست و مدیریت فضای ذخیره‌سازی را پیاده‌سازی کنم، یا
- C) ادامه دهم و تم تیره/روشن و انیمیشن تب را اضافه کنم.

