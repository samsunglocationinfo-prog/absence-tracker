# راهنمای استفاده از اجزاء — ردیاب غیبت

یک راهنمای عملی برای استفاده از اجزاء سیستم طراحی با مثال‌های واقعی.

## شروع سریع

### وارد کردن اجزاء

```typescript
import { Button, Input, Card, Modal, Alert, Badge } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
```

### وارد کردن ثابت‌ها

```typescript
import { PADDING, FONT_SIZE, TRANSITIONS, COMPONENT_VARIANTS } from '@/constants/design';
```

---

## الگوهای رایج

### 1. فرم با اعتبارسنجی

```jsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

// تابع تأیید ایمیل
const validateEmail = (text: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(text);
};

// مدیریت ارسال فرم
const handleSubmit = async () => {
  if (!validateEmail(email)) {
    setEmailError('آدرس ایمیل نامعتبر است');
    return;
  }

  setIsSubmitting(true);
  try {
    // فراخوانی API
    await submitEmail(email);
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <>
    <Input
      label="آدرس ایمیل"
      placeholder="ایمیل@نمونه.com"
      value={email}
      onChangeText={(text) => {
        setEmail(text);
        setEmailError('');
      }}
      error={emailError}
      helperText="ایمیل شما را هرگز به اشتراک نخواهیم گذاشت"
      required
    />
    <Button
      title="اشتراک"
      onPress={handleSubmit}
      loading={isSubmitting}
      fullWidth
    />
  </>
);
```

### 2. مودال با فرم

```jsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });

// ذخیره‌ی داده‌ها
const handleSave = async () => {
  // تأیید
  if (!formData.name || !formData.email) {
    // نمایش خطا
    return;
  }

  // ذخیره
  await saveData(formData);
  setIsOpen(false);
  setFormData({ name: '', email: '' });
};

return (
  <>
    <Button title="ایجاد" onPress={() => setIsOpen(true)} />

    <Modal
      visible={isOpen}
      title="ورودی جدید"
      subtitle="اطلاعات زیر را پر کنید"
      onClose={() => setIsOpen(false)}
      footer={
        <View style={{ flexDirection: 'column', gap: spacing.md }}>
          <Button
            title="لغو"
            variant="secondary"
            onPress={() => setIsOpen(false)}
            fullWidth
          />
          <Button title="ذخیره" onPress={handleSave} fullWidth />
        </View>
      }
    >
      <Input
        label="نام"
        placeholder="علی احمدی"
        value={formData.name}
        onChangeText={(name) => setFormData({ ...formData, name })}
      />
      <Input
        label="ایمیل"
        placeholder="علی@نمونه.com"
        value={formData.email}
        onChangeText={(email) => setFormData({ ...formData, email })}
      />
    </Modal>
  </>
);
```

### 3. لیست با نشان‌های وضعیت

```jsx
const items = [
  { id: 1, title: 'کار الف', status: 'تکمیل شده' },
  { id: 2, title: 'کار ب', status: 'درانتظار' },
];

// تابع برای نمایش نشان بر اساس وضعیت
const getStatusBadge = (status: string) => {
  const variants: Record<string, 'success' | 'warning' | 'error'> = {
    'تکمیل شده': 'success',
    'درانتظار': 'warning',
    'ناموفق': 'error',
  };

  return <Badge label={status} variant={variants[status] || 'neutral'} />;
};

return (
  <ScrollView>
    {items.map((item) => (
      <Card key={item.id} style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: typography.body, color: colors.textPrimary }}>
            {item.title}
          </Text>
          {getStatusBadge(item.status)}
        </View>
      </Card>
    ))}
  </ScrollView>
);
```

### 4. حالت‌های خطا و موفقیت

```jsx
const [state, setState] = useState('idle'); // idle | loading | success | error

// مدیریت اقدام
const handleAction = async () => {
  setState('loading');
  try {
    await performAction();
    setState('success');
    // بازنشانی بعد از 2 ثانیه
    setTimeout(() => setState('idle'), 2000);
  } catch (error) {
    setState('error');
  }
};

return (
  <>
    {state === 'success' && (
      <Alert
        title="موفقیت!"
        message="تغییرات شما ذخیره شده‌اند."
        variant="success"
      />
    )}

    {state === 'error' && (
      <Alert
        title="اشکالی رخ داد"
        message="لطفاً بعداً دوباره امتحان کنید."
        variant="error"
      />
    )}

    <Button
      title="ذخیره"
      onPress={handleAction}
      loading={state === 'loading'}
      disabled={state === 'loading'}
      fullWidth
    />
  </>
);
```

### 5. فرم چندمرحله‌ای

```jsx
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  step1: {},
  step2: {},
  step3: {},
});

const steps = [
  { title: 'اطلاعات شخصی', subtitle: 'در مورد خود بگویید' },
  { title: 'ترجیحات', subtitle: 'تنظیمات خود را انتخاب کنید' },
  { title: 'تایید', subtitle: 'بررسی و تایید کنید' },
];

// بروز به مرحله بعد
const handleNext = () => {
  // اعتبارسنجی مرحله‌ی فعلی
  if (validateStep(step)) {
    setStep((s) => Math.min(s + 1, steps.length));
  }
};

// بازگشت به مرحله قبل
const handleBack = () => {
  setStep((s) => Math.max(s - 1, 1));
};

return (
  <ScreenContainer>
    <AppHeader title={steps[step - 1].title} subtitle={steps[step - 1].subtitle} />

    {/* شاخص‌های مرحله */}
    <View style={{ flexDirection: 'row', marginBottom: spacing.lg, gap: spacing.md }}>
      {steps.map((_, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor:
              index < step - 1
                ? colors.success
                : index === step - 1
                  ? colors.accent
                  : colors.border,
          }}
        />
      ))}
    </View>

    {/* محتوای فرم */}
    <View style={{ flex: 1 }}>
      {step === 1 && <Step1Form data={formData.step1} onChange={(data) => setFormData({ ...formData, step1: data })} />}
      {step === 2 && <Step2Form data={formData.step2} onChange={(data) => setFormData({ ...formData, step2: data })} />}
      {step === 3 && <Step3Review data={formData} />}
    </View>

    {/* دکمه‌های ناوبری */}
    <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
      <Button
        title="بازگشت"
        variant="secondary"
        onPress={handleBack}
        disabled={step === 1}
        fullWidth
      />
      <Button
        title={step === steps.length ? 'ارسال' : 'بعدی'}
        onPress={step === steps.length ? handleSubmit : handleNext}
        fullWidth
      />
    </View>
  </ScreenContainer>
);
```

---

## راهنمایی‌های سبک‌دهی

### ✅ لازم است

```jsx
// استفاده‌ی توکن‌های پوسته
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
});

// استفاده‌ی توکن‌های تایپوگرافی
<Text style={{ fontSize: typography.body, color: colors.textPrimary }}>

// استفاده‌ی مقیاس فاصله‌گذاری
marginBottom: spacing.md
paddingHorizontal: spacing.lg

// استفاده‌ی گروه‌های رنگ
backgroundColor: colors.accentSubtle
```

### ❌ این کارها را نکنید

```jsx
// سخت‌کدگذاری مقادیر
padding: 20
borderRadius: 12
marginBottom: 16

// سخت‌کدگذاری رنگ‌ها
backgroundColor: '#8fb5ff'
color: '#f5f7ff'

// استفاده‌ی مقادیر دلخواه
marginBottom: 15
paddingHorizontal: 18
```

---

## طراحی واکنش‌پذیر

### اندازه‌های صفحه

```typescript
const screenWidth = useWindowDimensions().width;

const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
const isLargeScreen = screenWidth >= 768;
```

### طراحی‌های انعطاف‌پذیر

```jsx
// استفاده‌ی flex برای طراحی‌های واکنش‌پذیر
<View style={{ flexDirection: 'row', flex: 1 }}>
  <View style={{ flex: 1 }}>چپ</View>
  <View style={{ flex: 2 }}>راست (2x عرض)</View>
</View>

// استفاده‌ی gap برای فاصله‌گذاری سازگار
<View style={{ flexDirection: 'column', gap: spacing.md }}>
  {items.map(item => <Item key={item.id} />)}
</View>
```

---

## راهنمایی‌های دسترسی‌پذیری

### 1. اهداف لمسی

تمام عناصر تعاملی باید حداقل اندازه 44x44 نقطه داشته باشند:

```jsx
<Pressable style={{ minWidth: 44, minHeight: 44 }}>
  <Text>مرا لمس کنید</Text>
</Pressable>
```

### 2. تضاد رنگی

نسبت تضاد کافی اطمینان دهید (WCAG AA: 4.5:1 برای متن):

```jsx
// ✅ تضاد خوب
<Text style={{ color: colors.textPrimary }}>متن روی پس‌زمینه</Text>

// ❌ تضاد ضعیف
<Text style={{ color: colors.textTertiary, fontSize: 10 }}>خیلی سبک</Text>
```

### 3. برچسب‌ها برای ورودی‌ها

```jsx
// ✅ همیشه برچسب شامل کنید
<Input label="ایمیل" placeholder="..." />

// ❌ هرگز فقط بر روی placeholder تکیه نکنید
<TextInput placeholder="ایمیل" />
```

### 4. ساختار معنایی

```jsx
// ✅ استفاده‌ی اجزاء معنایی
<Button title="ارسال" />
<Input label="نام" />
<Card>محتوا</Card>

// ❌ از این اجتناب کنید
<Pressable><Text>ارسال</Text></Pressable>
<TextInput />
<View>محتوا</View>
```

---

## نکات کارایی

### 1. حفظ در حافظه (Memoization)

```jsx
import { memo } from 'react';

const ListItem = memo(({ item, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <Text>{item.title}</Text>
  </Pressable>
));
```

### 2. FlatList برای لیست‌های بلند

```jsx
import { FlatList } from 'react-native';

<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

### 3. از اشیاء Inline اجتناب کنید

```jsx
// ❌ تولید شی جدید در هر رندر
<Button style={{ marginBottom: spacing.md }} />

// ✅ یک بار تعریف کنید
const buttonStyle = { marginBottom: spacing.md };
<Button style={buttonStyle} />
```

---

## عیب‌یابی

### دکمه به فشارها پاسخ نمی‌دهد

- اطمینان دهید `onPress` تعریف شده است
- بررسی کنید پدر `pointerEvents="none"` ندارد
- تأیید کنید `disabled` true نیست

### متن ورودی نمایش داده نمی‌شود

- رنگ متن در برابر پس‌زمینه را بررسی کنید
- بررسی کنید اندازه فونت خیلی کوچک نیست
- اطمینان دهید ورودی ارتفاع کافی دارد

### مودال نشان داده نمی‌شود

- تأیید کنید `visible={true}`
- بررسی کنید اجزاء پدر رندر می‌شود
- مشکلات z-index را بررسی کنید

### سبک اعمال نمی‌شود

- وارد شدن‌ها از مسیر درست را تأیید کنید
- نحو StyleSheet را بررسی کنید
- اطمینان دهید جزء خاصیت `style` را می‌پذیرد

---

## منابع

- [مستندات سیستم طراحی](./DESIGN_SYSTEM_FA.md)
- [پیکربندی پوسته](./app/src/theme/dark.ts)
- [فهرس اجزاء](./app/src/components/ui/index.ts)
- [ثابت‌های طراحی](./app/src/constants/design.ts)
