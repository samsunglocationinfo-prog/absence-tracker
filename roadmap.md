# Roadmap — Memory Timeline / Absence Tracker

## 1. چشم‌انداز پروژه

پروژه‌ی Memory Timeline / Absence Tracker یک اپلیکیشن موبایل است که زمان را از زاویه‌ی احساسی، شخصی و روایی تجربه می‌کند. این محصول قرار نیست فقط یک شمارشگر زمان باشد؛ هدف آن ساختن یک «موزه‌ی دیجیتال از خاطرات و روزهای گذشته» است که در آن هر داده، داستانی دارد.

## 2. وضعیت فعلی پروژه

در این مرحله، اپ از حالت prototype به یک نسخه‌ی قابل‌استفاده و قابل‌نمایش نزدیک شده است. قابلیت‌های اصلی زیر در کد موجود‌اند:

- صفحه‌ی Home با تایمر زنده و نمایش چند لایه‌ی زمان
- Navigation با tab bar و header مدرن
- صفحه‌ی Journal با فرم ثبت خاطره و ذخیره‌ی محلی
- صفحه‌ی Analytics با ساختار اولیه و جایگاه برای insights آینده
- طراحی سیستم پایه با theme، card، button، input، modal و screen container
- storage abstraction برای persistence محلی

## 3. فلسفه‌ی محصول

- زمان فقط باید شمارش شود، نه صرفاً اندازه‌گیری
- تجربه‌ی کاربر باید آرام، مینیمال، عمیق و لوکس باشد
- هر بخش از اپ باید حس «گذشت زمان» را به شکلی متفاوت منتقل کند
- UI باید نزدیک به حس یک تجربه‌ی هنری و شخصی باشد، نه یک ابزار بهره‌وری ساده

## 4. نسخه‌ی هدف (Vision)

نسخه‌ی نهایی این محصول باید بتواند:

- زمان را در چند لایه‌ی متفاوت نشان دهد
- خاطرات کاربر را در قالب یک تایم‌لاین زنده نگه دارد
- احساس کاربر را با داده‌ها روایت کند
- اطلاعات را با ظاهری آرام، لوکس و مدرن ارائه دهد
- امنیت و حریم خصوصی را در بالاترین سطح رعایت کند

## 5. فازبندی به‌روز شده پروژه

### فاز 0 — Foundation (تکمیل‌شده)

هدف:
- تثبیت نیازمندی‌ها
- تعریف معماری و ساختار فنی
- ایجاد base experience بصری

وضعیت فعلی:
- [x] Expo + React Native + TypeScript راه‌اندازی شد
- [x] ساختار پوشه‌ای و component library پایه ایجاد شد
- [x] theme و reusable UI ساخته شد
- [x] navigation و screen‌های اصلی اضافه شد

### فاز 1 — MVP اولیه (در حال اجرا)

هدف:
- ساخت نسخه‌ی اولیه‌ی قابل استفاده از اپ

ویژگی‌های اصلی:
- [x] صفحه‌ی Home با تایمر اصلی
- [x] نمایش Time Perspectives
- [x] Without… counters
- [x] بخش What Happened While Away
- [x] Seasonal Timeline
- [x] ثبت و نمایش basic memories
- [x] داده‌های محلی و پایدار

مرحله‌ی بعدی:
- افزودن ویرایش و حذف entry‌ها
- ارتقای مدل journal با tags، weather و location
- اضافه‌کردن media support
- بهبود empty states و onboarding

### فاز 2 — Core Experience Expansion

هدف:
- غنی‌ترکردن تجربه‌ی اصلی اپ

ویژگی‌های اضافه‌شده در برنامه:
- ژورنال کامل با media support
- Daily Reflection
- Last Memory Dashboard
- Monthly Progress
- Missed Events
- Emotional Statistics
- Astronomical Statistics

### فاز 3 — Personalization و Security

هدف:
- افزایش ارزش احساسی و امنیتی اپ

ویژگی‌ها:
- Secure Memory Vault
- Face ID / Fingerprint / Passcode
- themes و personalization
- تنظیمات اعلان‌ها
- حالت‌های خاص فصلی و دکوراتیو

### فاز 4 — Sync و Cloud Experience

هدف:
- تبدیل اپ به یک محصول چنددستگاهی و قابل‌اعتماد

ویژگی‌ها:
- authentication
- cloud backup
- multi-device sync
- restore و conflict resolution

### فاز 5 — Intelligence و Growth

هدف:
- تبدیل محصول به یک تجربه‌ی هوشمند و ماندگار

ویژگی‌ها:
- AI-generated reflections
- memory recommendations
- smart search
- emotion trend analysis
- personalized insights
- widgets و lock screen widgets

## 6. معماری پیشنهادی

### Frontend

- React Native + Expo
- TypeScript
- React Navigation
- Expo Vector Icons
- Linear Gradient برای UI لوکس

### State و Data

- Zustand برای state محلی
- AsyncStorage برای persistence ساده
- آماده برای ارتقا به SQLite / SecureStore

### Backend / Sync

پیشنهاد اصلی:
- Supabase

چرا:
- ساده برای auth و database
- مناسب برای storage و sync
- مناسب برای MVP و رشد آینده

### Analytics و Monitoring

- Sentry برای خطاها
- PostHog یا Firebase Analytics برای تحلیل رفتار
- Crashlytics برای اندروید و iOS

## 7. مدل داده‌های پیشنهادی

### Entities اصلی

- User
- AbsenceProfile
- MemoryEntry
- Milestone
- CounterMetric
- LocationMemory
- Reminder
- Settings
- MediaAttachment

### رابطه‌ها

- هر کاربر یک یا چند AbsenceProfile دارد
- هر AbsenceProfile چندین MemoryEntry دارد
- هر MemoryEntry می‌تواند چند MediaAttachment داشته باشد
- هر کاربر چند CounterMetric و Reminder دارد

## 8. تجربه‌ی کاربری پیشنهادی

### صفحه‌ی اصلی

- تایمر اصلی با انتقال نرم و انیمیشن ملایم
- نمایش چند لایه‌ی زمان
- کارت‌های مرتبط با حس و خاطره
- امکان ورود سریع به ژورنال و خاطرات

### صفحه‌ی ژورنال

- ثبت خاطره با چندین نوع ورودی
- timeline-based browsing
- فیلتر بر اساس mood، tag، ماه و سال

### صفحه‌ی Analytics

- نمودارهای شفاف و آرام
- نمایش روند احساسی و زمانی
- داستان‌گویی داده‌ها به‌جای نمایش عددی خالص

## 9. پیشنهادهای بهبود برای پروژه

### 9.1 بهبود UX

- افزودن onboarding بسیار ظریف و شخصی
- ساخت حالت‌های مختلف برای بازه‌های زمانی
- نمایش «معانی» هر عدد به‌جای صرفاً عدد
- استفاده از micro-interactions نرم و آرام
- اضافه‌کردن حالت‌های empty state بسیار زیبا

### 9.2 بهبود طراحی

- اجرای theme system حرفه‌ای
- استفاده از gradients آرام و یکنواخت
- اضافه‌کردن motion language منسجم
- افزایش استفاده از glassmorphism در حد ملایم و شیک
- طراحی icon system و illustration system

### 9.3 بهبود محصول

- افزودن widgets و lock screen widgets
- ساخت notifications با تنظیمات کامل
- اضافه‌کردن AI-generated daily reflections
- ایجاد smart search برای خاطرات
- افزودن milestones با summaries روان و احساسی

### 9.4 بهبود فنی

- ساخت architecture modular و قابل توسعه
- جداسازی business logic از UI
- ایجاد service layer برای storage، sync، analytics و notification
- استفاده از test-driven development برای core logic
- ساخت CI/CD برای انتشار نسخه‌ها

### 9.5 بهبود حریم خصوصی

- رمزگذاری کامل داده‌های حساس
- امکان پاک‌کردن سریع اطلاعات از دستگاه
- کنترل کامل بر روی اشتراک‌گذاری فایل‌ها
- هشدار در مورد ذخیره‌سازی و sync

## 10. پیشنهادهای استراتژیک برای رشد محصول

- تبدیل شدن به محصولی برای تجربه‌ی روابط عمیق، دوری و یادآوری
- اضافه‌کردن زبان‌های مختلف و پشتیبانی از تقویم‌های مختلف
- ساخت نسخه‌ی premium با امکانات پیشرفته‌تر
- امکان ساخت «آرشیو شخصی سالانه» و «سال‌نامه‌ی احساسی»
- ایجاد یک تجربه‌ی «memory museum» با حالت‌های خاص و دکوراتیو

## 11. معیارهای موفقیت

- اپ در کمتر از 5 ثانیه به کاربر تجربه‌ی اصلی را ارائه دهد
- کاربر بتواند بدون سردرگمی، خاطره ثبت کند
- UI حس آرامش و کیفیت بالا بدهد
- داده‌ها در حالت آفلاین قابل‌استفاده باشند
- کاربر احساس کند محصول «شخصی، ارزشمند و ماندگار» است

## 12. برنامه‌ی عملی برای 90 روز آینده

### ماه 1

- تکمیل معماری و ساختار داده
- پیاده‌سازی صفحه‌های اصلی و core screens
- طراحی system و reusable components

### ماه 2

- پیاده‌سازی ژورنال و media handling
- اضافه‌کردن analytics و counters
- طراحی secure storage و local persistence

### ماه 3

- اضافه‌کردن sync، auth و backup
- بهبود UI/UX با feedback واقعی
- آماده‌سازی برای beta test

## 13. جمع‌بندی

این پروژه ظرفیت تبدیل شدن به یک محصول بسیار خاص و متمایز را دارد. اگر به‌صورت مرحله‌ای، حرفه‌ای و با تمرکز روی تجربه‌ی احساسی کاربر توسعه پیدا کند، می‌تواند فراتر از یک ابزار ساده‌ی زمان‌سنجی، به یک تجربه‌ی شخصی و عمیق تبدیل شود که در ذهن کاربر باقی بماند.
