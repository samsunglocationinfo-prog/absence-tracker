# سیستم طراحی — ردیاب غیبت

یک سیستم طراحی حرفه‌ای، قابل دسترس و قابل‌توسعه برای تطبیق Memory Timeline / Absence Tracker.

## بررسی اجمالی

این سیستم طراحی مجموعه‌ای کامل از اجزاء قابل استفاده مجدد، توکن‌ها و الگوهای طراحی را برای ایجاد رابط‌های سازگار و زیبا فراهم می‌کند.

### فلسفه‌ی طراحی

- **وضوح**: هر جزء یک هدف واضح دارد
- **دسترسی‌پذیری**: با رعایت اصول طراحی فراگیر ساخته شده
- **سازگاری**: یکپارچه در تمام صفحات
- **انعطاف‌پذیری**: گزینه‌های تنوع و سفارشی‌سازی
- **کارایی**: بهینه‌شده برای دستگاه‌های موبایل

---

## پالت رنگی

### رنگ‌های اصلی

| نام | مقدار | کاربرد |
|-----|-------|--------|
| **لهجه (Accent)** | `#8fb5ff` | عناصر تعاملی، برجسته‌سازی |
| **لهجه نرم** | `#84a6dc` | عناصر تعاملی ثانویه |
| **لهجه ظریف** | `rgba(143, 181, 255, 0.12)` | پس‌زمینه برجسته |

### رنگ‌های متن

| نام | مقدار | کاربرد |
|-----|-------|--------|
| **متن اساسی** | `#f5f7ff` | متن اصلی، عنوان‌ها |
| **متن ثانویه** | `#8ca0ca` | متن ثانویه، برچسب‌ها |
| **متن سوم** | `#5d6b93` | متن مربوط، خافت‌شده |

### رنگ‌های سطح (Surface)

| نام | مقدار | کاربرد |
|-----|-------|--------|
| **پس‌زمینه** | `#060816` | پس‌زمینه صفحه‌ی اصلی |
| **سطح** | `#101830` | کارت‌ها، ظروف |
| **سطح بالاتر** | `#1d2748` | لایه‌های بالاتر |

### رنگ‌های معنایی

| نام | کاربرد | رنگ‌ها |
|-----|--------|--------|
| **موفقیت** | حالات موفقیت | `#7dd3c7` (اصلی)، `rgba(..., 0.12)` (ظریف) |
| **خطا** | حالات خطا | `#ff6b6b` (اصلی)، `rgba(..., 0.12)` (ظریف) |
| **هشدار** | حالات هشدار | `#f4c27a` (اصلی)، `rgba(..., 0.12)` (ظریف) |
| **اطلاع** | اطلاعات | `#6db3f2` (اصلی)، `rgba(..., 0.12)` (ظریف) |

### مرزها

| نام | مقدار | کاربرد |
|-----|-------|--------|
| **مرز** | `rgba(255,255,255,0.12)` | مرزهای استاندارد |
| **مرز سبک** | `rgba(255,255,255,0.06)` | جداکننده‌های ظریف |

---

## مقیاس فاصله‌گذاری

```javascript
xs:   4px    // فاصله‌های بسیار کوچک
sm:   8px    // فاصله‌های کوچک، الف
md:  16px    // پیش‌فرض، فاصله‌ی استاندارد
lg:  20px    // فاصله‌ی بزرگ
xl:  24px    // فاصله‌ی خیلی بزرگ
2xl: 32px    // فاصله‌ی بخش‌های کامل
```

از توکن `spacing` برای تمام حاشیه‌ها و الف‌ها استفاده کنید.

---

## تایپوگرافی

```javascript
title:    28px  // عنوان‌های صفحه، عنوان‌های بزرگ
subtitle: 18px  // عنوان‌های بخش
body:     14px  // متن اصلی
caption:  12px  // برچسب‌ها، متن کمکی
micro:    11px  // متن Badge، بسیار کوچک
```

تمام تایپوگرافی از `fontWeight` 600-700 برای عنوان‌ها و 500 برای بدن استفاده می‌کند.

---

## شعاع مرز

```javascript
sm:   8px     // عناصر کوچک
md:  12px     // دکمه‌ها، ورودی‌ها (پیش‌فرض)
lg:  16px     // کارت‌ها، مودال‌ها
xl:  24px     // ظروف بزرگ
full: 9999px  // Badge، حبوبی
```

---

## اجزاء

### دکمه (Button)

جزء دکمه‌ی چند‌منظوره با تنوع و اندازه‌های مختلف.

#### خصوصیات

```typescript
type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};
```

#### تنوع‌ها

```jsx
// اساسی (پیش‌فرض)
<Button title="ذخیره" variant="primary" />

// ثانویه
<Button title="لغو" variant="secondary" />

// شفاف
<Button title="بیشتر بدانید" variant="ghost" />

// خطر
<Button title="حذف" variant="danger" />
```

#### اندازه‌ها

```jsx
<Button title="کوچک" size="sm" />
<Button title="متوسط" size="md" />     // پیش‌فرض
<Button title="بزرگ" size="lg" />
```

#### حالت‌ها

```jsx
// در حال بارگذاری
<Button title="ذخیره" loading />

// غیرفعال
<Button title="ذخیره" disabled />

// عرض کامل
<Button title="ذخیره" fullWidth />
```

---

### ورودی (Input)

جزء ورودی انعطاف‌پذیر با مدیریت خطا و حالت‌های اعتبارسنجی.

#### خصوصیات

```typescript
type InputProps = TextInputProps & {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  multiline?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  containerStyle?: ViewStyle;
};
```

#### استفاده‌ی اساسی

```jsx
<Input
  label="ایمیل"
  placeholder="ایمیل@نمونه.com"
  value={email}
  onChangeText={setEmail}
/>
```

#### با اعتبارسنجی

```jsx
<Input
  label="رمز عبور"
  value={password}
  onChangeText={setPassword}
  error={passwordError ? "رمز عبور الزامی است" : undefined}
  helperText="حداقل 8 کاراکتر"
/>
```

#### چندخطی

```jsx
<Input
  label="پیام"
  multiline
  value={message}
  onChangeText={setMessage}
  maxLength={500}
  showCharCount
/>
```

#### اندازه‌ها

```jsx
<Input size="sm" label="کوچک" />
<Input size="md" label="متوسط" />   // پیش‌فرض
<Input size="lg" label="بزرگ" />
```

---

### مودال (Modal)

یک دیالوگ مودال سفارشی‌پذیر با پاصورت و پیمایش اختیاری.

#### خصوصیات

```typescript
type ModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  footer?: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
};
```

#### استفاده‌ی اساسی

```jsx
<Modal
  visible={modalVisible}
  title="ایجاد یادآوری"
  onClose={() => setModalVisible(false)}
>
  <Input label="عنوان" />
  <Input label="محتوا" multiline />
</Modal>
```

#### با پاصورت

```jsx
<Modal
  visible={modalVisible}
  title="تایید اقدام"
  onClose={() => setModalVisible(false)}
  footer={
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Button title="لغو" variant="secondary" onPress={() => setModalVisible(false)} fullWidth />
      <Button title="تایید" onPress={handleConfirm} fullWidth />
    </View>
  }
>
  <Text>آیا مطمئن هستید؟</Text>
</Modal>
```

#### اندازه‌ها

```jsx
<Modal size="sm" title="کوچک" />      // 300px حداکثر
<Modal size="md" title="متوسط" />     // 400px حداکثر (پیش‌فرض)
<Modal size="lg" title="بزرگ" />      // 500px حداکثر
<Modal size="full" title="کامل" />    // عرض کامل
```

---

### فیلد فرم (FormField)

یک جعبه‌ای که Input، برچسب و متن کمکی را ترکیب می‌کند برای ساختار فرم تمیز‌تر.

#### خصوصیات

```typescript
type FormFieldProps = InputProps & {
  label: string;
  required?: boolean;
  description?: string;
  containerStyle?: ViewStyle;
};
```

#### استفاده

```jsx
<FormField
  label="نام کامل"
  placeholder="علی احمدی"
  required
  description="نام قانونی خود"
  value={name}
  onChangeText={setName}
/>
```

---

### نشان (Badge)

یک جزء برچسب کوچک برای برچسب‌ها، شاخص‌های وضعیت و دسته‌بندی‌ها.

#### خصوصیات

```typescript
type BadgeProps = {
  label: string;
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
};
```

#### استفاده

```jsx
<Badge label="جدید" variant="accent" />
<Badge label="تایید شده" variant="success" />
<Badge label="در انتظار" variant="warning" />
<Badge label="ناموفق" variant="error" />
```

---

### هشدار (Alert)

یک جعبه اطلاعات برای نمایش پیام‌های مهم.

#### خصوصیات

```typescript
type AlertProps = {
  title: string;
  message?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  style?: ViewStyle;
};
```

#### استفاده

```jsx
<Alert
  title="یادآوری ذخیره شد"
  message="بازتاب شما به‌طور ایمن ذخیره شده است."
  variant="success"
/>

<Alert
  title="خطای اعتبارسنجی"
  message="لطفاً تمام فیلد‌های الزامی را پر کنید."
  variant="error"
/>
```

---

### جداکننده (Divider)

یک جداکننده‌ی بصری برای گروه‌بندی محتوا.

#### خصوصیات

```typescript
type DividerProps = {
  vertical?: boolean;
  style?: ViewStyle;
  color?: string;
};
```

#### استفاده

```jsx
// افقی (پیش‌فرض)
<Divider />

// عمودی
<Divider vertical />

// رنگ سفارشی
<Divider color={colors.error} />
```

---

### بارگذاری (Loading)

یک شاخص بارگذاری مرکزی با پیام اختیاری.

#### خصوصیات

```typescript
type LoadingProps = {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
};
```

#### استفاده

```jsx
<Loading message="در حال بارگذاری یادآوری‌ها..." />
<Loading fullScreen message="لطفاً صبر کنید..." />
```

---

### ظرف صفحه (ScreenContainer)

یک جعبه‌ای که پس‌زمینه سازگار، حاشیه‌های ایمن و الف را فراهم می‌کند برای صفحات.

#### خصوصیات

```typescript
type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: 'default' | 'subtle' | 'strong';
  padding?: boolean;
};
```

#### استفاده

```jsx
<ScreenContainer>
  <AppHeader title="زمان‌خط" />
  <Content />
</ScreenContainer>

// با گرادیان سفارشی
<ScreenContainer gradient="subtle">
  {/* محتوا */}
</ScreenContainer>
```

---

## بهترین شیوه‌ها

### 1. **فاصله‌گذاری و تراز**

همیشه از مقیاس فاصله‌گذاری استفاده کنید:

```jsx
// ✅ خوب
style={{ marginBottom: spacing.md, paddingHorizontal: spacing.lg }}

// ❌ از این اجتناب کنید
style={{ marginBottom: 16, paddingHorizontal: 20 }}
```

### 2. **تایپوگرافی**

سبک‌های متن سازگار استفاده کنید:

```jsx
// ✅ خوب
<Text style={{ fontSize: typography.body, color: colors.textPrimary }}>

// ❌ از این اجتناب کنید
<Text style={{ fontSize: 14, color: '#fff' }}>
```

### 3. **رنگ‌ها**

به‌جای سخت‌کدگذاری، رنگ‌های پوسته استفاده کنید:

```jsx
// ✅ خوب
style={{ borderColor: colors.border }}

// ❌ از این اجتناب کنید
style={{ borderColor: 'rgba(255,255,255,0.12)' }}
```

### 4. **اعتبارسنجی فرم**

همیشه اعتبارسنجی و بازخورد ارائه دهید:

```jsx
<Input
  label="ایمیل"
  value={email}
  onChangeText={setEmail}
  error={!isValidEmail(email) ? "ایمیل نامعتبر است" : undefined}
/>
```

### 5. **دسترسی‌پذیری**

- تمام عناصر تعاملی باید حداقل 44x44 اندازه داشته باشند
- برچسب‌ها برای تمام ورودی‌ها الزامی‌اند
- از رنگ معنایی استفاده کنید (نه فقط رنگ برای معنی)
- با صدای تصویر آزما کنید

### 6. **کارایی**

- اجزاء را به‌خاطر‌نگاهی کنید
- از ScrollView با `showsVerticalScrollIndicator={false}` استفاده کنید
- از inline style objects اجتناب کنید

---

## صعود و حرکت

زمان‌های انتقالی استاندارد:

```javascript
fast: 150ms   // بازخورد سریع
base: 250ms   // انیمیشن‌های استاندارد
slow: 350ms   // انتقال‌های خاکستری
```

---

## صادرات و استفاده

تمام اجزاء از `src/components/ui/index.ts` صادر می‌شوند:

```jsx
import { Button, Input, Modal, Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
```

---

## بهبود‌های آینده

- [ ] تبدیل تم (حالت‌های تاریک/روشن)
- [ ] پشتیبانی RTL برای فارسی/اردو
- [ ] سیستم بومی‌سازی
- [ ] Storybook برای اجزاء
- [ ] کتابخانه انیمیشن‌ها و انتقال‌ها
- [ ] پشتیبانی بازخورد لمسی (Haptic)
