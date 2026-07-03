# Todo — Memory Timeline / Absence Tracker

## 1. هدف پروژه

این پروژه یک اپلیکیشن موبایل مدرن و احساسی است که زمان را نه فقط به‌صورت عددی، بلکه به‌صورت روایتی، احساسی و شخصی تجربه می‌کند. هدف این است که کاربر هر بار که اپ را باز می‌کند، احساس کند زمان از چند زاویه عبور کرده است: زمانی، احساسی، فصلی، نجومی و شخصی.

## 2. وضعیت فعلی

- [x] پایه‌ی پروژه با Expo + React Native + TypeScript راه‌اندازی شده است.
- [x] یک نسخه‌ی اولیه‌ی قابل اجرا از Home screen با تایمر زنده و تجربه‌ی بصری لوکس ساخته شده است.
- [x] navigation با tab bar و header حرفه‌ای پیاده‌سازی شده است.
- [x] Journal screen به فرم واقعی و ذخیره‌ی محلی خاطره تبدیل شده است.
- [x] طراحی سیستم پایه با components reusable و theme روشن/تاریک در حال اجرا است.
- [x] storage abstraction برای داده‌های محلی آماده شده است.

## 3. اولویت‌های اصلی

1. تبدیل prototype به محصول قابل‌استفاده و قابل‌اعتماد
2. تکمیل ذخیره‌سازی و مدل داده‌ی journal
3. غنی‌سازی تجربه‌ی اصلی: Home، Journal، Analytics
4. افزودن امنیت، media support و پشتیبان‌گیری
5. آماده‌سازی برای نسخه‌ی MVP و تست اولیه

## 4. برنامه‌ی اجرایی (به‌روز شده)

### فاز A — تثبیت پایه و معماری

- [x] بررسی و نهایی‌کردن معماری پروژه
- [x] انتخاب ابزارهای داده و ذخیره‌سازی
- [x] تعریف ساختار پوشه‌ها و کامپوننت‌ها
- [x] تعریف system design برای theme، spacing، typography و motion
- [x] ایجاد base services برای زمان، تاریخ و تنظیمات کاربر
- [x] تعریف قرارداد داده برای entities اصلی

### فاز B — طراحی سیستم و تجربه کاربری

- [x] تکمیل طراحی سیستم (color palette، typography، motion، spacing)
- [x] ایجاد components قابل استفاده مجدد:
  - [x] Card
  - [x] SectionHeader
  - [x] MetricTile
  - [x] EmptyState
  - [x] Chip
  - [x] Button / Input / Modal / ScreenContainer
- [x] اضافه‌کردن حالت‌های empty و content-based layout
- [x] طراحی نسخه‌ی dark mode و ساختار آماده برای light mode
- [ ] تنظیم accessibility و reduced motion

### فاز C — پیاده‌سازی هسته‌ی محصول

- [x] ساخت صفحه‌ی Home با تایمر اصلی
- [x] اضافه‌کردن Time Perspectives cards
- [x] پیاده‌سازی Without… counters
- [x] ساخت بخش What Happened While Away
- [x] ساخت Seasonal Timeline
- [ ] افزودن Monthly Progress
- [ ] اضافه‌کردن Missed Events
- [ ] پیاده‌سازی Emotional Statistics
- [ ] پیاده‌سازی Astronomical Statistics

### فاز D — ژورنال و حافظه

- [x] ساخت Memory Journal
- [x] افزودن امکان ثبت متن، mood و reflection
- [ ] افزودن weather، location و tags
- [ ] اجازه‌ی افزودن عکس، ویدیو و voice note
- [ ] نمایش ورودی‌ها روی تایم‌لاین
- [ ] اتصال هر ورودی به روز خاص
- [ ] پیاده‌سازی جست‌وجوی حافظه‌ها

### فاز E — داده‌های شخصی و زمان

- [ ] ساخت Last Memory Dashboard
- [ ] اضافه‌کردن Last Meeting / Last Call / Last Message / Last Voice Note
- [ ] ساخت Location Memory با نقشه
- [ ] پیاده‌سازی Countdown Features
- [ ] افکت‌های milestone و unlock animation
- [ ] ساخت Daily Reflection generator

### فاز F — امنیت و ذخیره‌سازی

- [x] اضافه‌کردن ذخیره‌سازی محلی و پایدار
- [ ] پیاده‌سازی encrypted storage برای اطلاعات حساس
- [ ] اضافه‌کردن Face ID / Fingerprint / Passcode (در صورت پشتیبانی پلتفرم)
- [ ] ساخت Secure Memory Vault
- [ ] طراحی حالت offline-first
- [ ] پیاده‌سازی backup و restore

### فاز G — همگام‌سازی و ابری

- [ ] انتخاب سرویس ابری (پیشنهاد: Supabase یا Firebase)
- [ ] پیاده‌سازی authentication
- [ ] همگام‌سازی داده‌ها بین دستگاه‌ها
- [ ] مدیریت conflicts و نسخه‌گذاری داده
- [ ] پشتیبانی از sync در حالت آفلاین

### فاز H — تست و کیفیت

- [ ] نوشتن unit tests برای منطق زمان و محاسبات
- [ ] نوشتن integration tests برای flows اصلی
- [ ] تست روی Android و iOS
- [ ] تست accessibility
- [ ] تست عملکرد و روانی UI
- [ ] تست روی حالت‌های مختلف شبکه و داده

### فاز I — انتشار و بهبود مداوم

- [ ] آماده‌سازی نسخه‌ی اولیه برای تست اولیه
- [ ] جمع‌آوری بازخورد کاربران
- [ ] تحلیل رفتار و نرخ استفاده
- [ ] انتشار نسخه‌ی beta
- [ ] برنامه‌ریزی برای نسخه‌ی 1.0

## 5. جزئیات فنی فعلی

### Frontend

- React Native + Expo
- TypeScript
- React Navigation
- Expo Vector Icons
- Linear Gradient برای UI لوکس

### State Management

- Zustand برای state محلی
- AsyncStorage برای persistence ساده

### Data Storage

- storage abstraction برای JSON-based persistence
- آماده برای ارتقا به SQLite / SecureStore

## 6. پیشنهادهای بهبود پروژه

### تجربه‌ی کاربری

- اضافه‌کردن onboarding ظریف و احساسی
- ساخت حالت‌های مختلف برای فواصل زمانی
- شخصی‌سازی متن‌های reflective بر اساس نوع رابطه و سبک کاربر
- افزودن حالت‌های calming و ambient برای کاهش حس غم‌انگیز بودن UI

### طراحی

- استفاده از motion system با animation‌های نرم و آرام
- اضافه‌کردن seasonal themes و dynamic backgrounds
- ساخت components با depth و glassmorphism ملایم
- استفاده از typography premium و spacing منظم

### محصول

- اضافه‌کردن widgets برای iOS و Android
- ساخت notifications با تنظیمات شخصی
- افزودن smart suggestions برای memory entries
- اضافه‌کردن AI-generated reflections و summaries
- طراحی dashboard برای روند احساسی کاربر

### فنی

- اجرای offline-first به‌صورت کامل
- بهینه‌سازی برای عملکرد روی دستگاه‌های ضعیف‌تر
- ساخت backup/restore قوی
- پیاده‌سازی background sync
- اضافه‌کردن test coverage بالا

## 7. معیارهای موفقیت

- کاربر بتواند در کمتر از 3 دقیقه، یک memory یا entry ثبت کند
- تجربه‌ی UI روان و بدون lag باشد
- داده‌ها در حالت آفلاین به‌طور کامل کار کنند
- کاربر بتواند بدون راهنمایی، بخش‌های اصلی را درک کند
- احساس‌های کاربر در UI منعکس شود، نه صرفاً اعداد

## 8. کارهای فوری بعدی

1. ارتقای مدل داده‌ی journal با tags، weather، location
2. افزودن ویرایش و حذف entry‌ها
3. اضافه‌کردن media support برای عکس/صدا
4. ساخت onboarding و تنظیمات کاربر
5. آماده‌سازی نسخه‌ی MVP برای تست اولیه

## 9. جمع‌بندی

این پروژه از مرحله‌ی prototype به سمت یک اپلیکیشن قابل‌استفاده و قابل‌اتکا پیش رفته است. با ادامه‌ی این مسیر، می‌توان آن را به یک تجربه‌ی احساسی، شخصی و ماندگار تبدیل کرد که هم از نظر محصول و هم از نظر معماری آماده‌ی رشد است.
