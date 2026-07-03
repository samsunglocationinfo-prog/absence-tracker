# Architecture Document — Memory Timeline / Absence Tracker

## 1. هدف معماری

معماری این پروژه باید امکان توسعه‌ی سریع، نگه‌داری ساده، و افزودن قابلیت‌های بعدی را فراهم کند. هدف این است که محصول از یک prototype اولیه به یک اپلیکیشن قابل‌استفاده و قابل‌گسترش تبدیل شود بدون اینکه کدها برای توسعه‌ی آینده شلوغ و غیرقابل‌نگهداری شوند.

## 2. اصول معماری

- Separation of concerns
- Modular component design
- State management predictable
- Offline-first data handling
- Secure storage for sensitive data
- Reusable UI primitives
- Clear domain boundaries

## 3. معماری کلی

### 3.1 لایه‌ها

1. Presentation Layer
   - Screens
   - Components
   - Theme and styling
   - Animations

2. Domain Layer
   - Calculations of time
   - Milestones
   - Emotional counters
   - Reflection logic

3. Data Layer
   - Local database
   - Cache
   - Sync services
   - File storage

4. Infrastructure Layer
   - Auth
   - Cloud storage
   - Analytics
   - Notifications
   - Security services

## 4. پیشنهاد ساختار پوشه‌ها

```text
src/
  app/
    navigation/
    screens/
    routes/
  components/
    ui/
    features/
    layout/
  features/
    timeline/
    journal/
    analytics/
    vault/
    settings/
  hooks/
  services/
    storage/
    sync/
    auth/
    notifications/
    analytics/
  store/
    slices/
    providers/
  utils/
    date/
    time/
    formatters/
    validators/
  types/
  constants/
  theme/
```

## 5. گزینه‌های مدیریت state

### پیشنهاد اولیه

- Zustand برای state محلی و ساده

### چرا

- سبک
- مناسب برای React Native
- کم‌حجم و قابل‌فهم
- مناسب برای MVP و رشد بعدی

### برای داده‌های ابری

- React Query / TanStack Query برای fetch، cache و sync

## 6. ذخیره‌سازی داده

### 6.1 داده‌های محلی

- SQLite برای داده‌های ساختاریافته
- SecureStore برای تنظیمات حساس
- AsyncStorage یا MMKV برای state سبک و سریع

### 6.2 داده‌های چندرسانه‌ای

- فایل‌های تصویری، ویدیویی و صوتی در filesystem یا storage service ذخیره شوند
- برای دیتابیس، فقط metadata نگهداری شود

### 6.3 حالت offline-first

- همه‌ی داده‌های مهم ابتدا روی دستگاه ذخیره شوند
- sync در background انجام شود
- در صورت قطع اتصال، اپ همچنان قابل استفاده باشد

## 7. مدل‌های داده‌ای پیشنهادی

### User

- id
- name
- themePreference
- language
- createdAt

### AbsenceProfile

- id
- userId
- startDate
- title
- relationshipType
- notes

### MemoryEntry

- id
- profileId
- date
- text
- mood
- weather
- location
- tags
- createdAt

### CounterMetric

- id
- profileId
- key
- label
- value
- unit
- createdAt

### MediaAttachment

- id
- memoryId
- type
- uri
- thumbnailUri
- createdAt

### Reminder

- id
- profileId
- type
- date
- enabled

## 8. منطق کسب‌وکار

### 8.1 Time calculations

- محاسبه‌ی روز، هفته، ماه، فصل و سال از تاریخ شروع
- امکان نمایش چندین view از یک فاصله‌ی زمانی
- محاسبه‌ی رویدادها و milestones بر اساس تقویم

### 8.2 Emotional counters

- counters قابل تنظیم و سفارشی‌سازی
- امکان ثبت مقدار manual یا automatic
- نمایش روند در طول زمان

### 8.3 Reflections

- تولید متن روزانه یا milestone-based
- در فازهای بعدی با AI دنبال شود

## 9. UI architecture

### 9.1 Component design

- components باید tiny, composable و reusable باشند
- از props و composition استفاده شود
- complex logic در hooks یا services نگهداری شود

### 9.2 Theme system

- colors
- spacing
- typography
- shadows
- motion
- radius

### 9.3 Motion system

- animations باید آرام و غیرمزاحم باشند
- reduced motion باید پشتیبانی شود

## 10. Navigation

### پیشنهاد

- React Navigation
- stack + tab navigation

### Screens پیشنهادی

- Home
- Timeline
- Journal
- Analytics
- Vault
- Settings
- Memory Details
- Add Memory
- Onboarding

## 11. Security architecture

- داده‌های حساس با SecureStore یا Keychain/Keystore ذخیره شوند
- برای فایل‌های خصوصی، access control مناسب داشته باشند
- در صورت امکان از encrypted database استفاده شود
- داده‌ی حساس در حالت انتقال و ذخیره‌سازی محافظت شود

## 12. Sync و Cloud

### نسخه‌ی اولیه

- داده‌ها فقط محلی باشند

### نسخه‌ی بعدی

- auth با Supabase یا Firebase
- sync با conflict handling
- backup و restore

## 13. Testing strategy

- unit tests برای logic و utilities
- integration tests برای flows اصلی
- UI tests برای core journeys
- accessibility testing
- performance validation

## 14. پیشنهادهای پیاده‌سازی مرحله‌ای

### مرحله 1

- ساخت screens اصلی
- ایجاد theme system
- پیاده‌سازی time calculations
- دیتابیس محلی ساده

### مرحله 2

- اضافه‌کردن journal flow
- ساخت memory entry form
- پیاده‌سازی analytics basics

### مرحله 3

- اضافه‌کردن security و vault
- sync و cloud
- notifications و widgets

## 15. جمع‌بندی

معماری این پروژه باید هم برای MVP ساده و قابل‌فهم باشد و هم برای آینده‌ی محصول قابل‌گسترش. تمرکز باید روی تجربه‌ی کاربر، کیفیت طراحی، و ساختار داده‌ی قابل‌اعتماد باشد.
