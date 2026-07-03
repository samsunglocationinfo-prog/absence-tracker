# راهنمای سیستم طراحی - فارسی

سلام! این پروژه اکنون یک **سیستم طراحی حرفه‌ای و مکمل** دارد. تمام مستندات به فارسی نوشته‌شده‌اند.

## 📚 مستندات فارسی

### 1. **[DESIGN_SYSTEM_FA.md](./DESIGN_SYSTEM_FA.md)** 🎨
راهنمای سیستم طراحی کامل:
- پالت رنگی (20 رنگ معنایی)
- مقیاس فاصله‌گذاری
- تایپوگرافی
- توضیح تمام اجزاء
- بهترین شیوه‌ها

### 2. **[COMPONENT_GUIDE_FA.md](./COMPONENT_GUIDE_FA.md)** 💡
مثال‌های عملی برای استفاده:
- فرم با اعتبارسنجی
- مودال با فرم
- لیست با نشان‌های وضعیت
- حالت‌های خطا و موفقیت
- فرم چندمرحله‌ای

### 3. **[DESIGN_SYSTEM_SUMMARY_FA.md](./DESIGN_SYSTEM_SUMMARY_FA.md)** 📊
خلاصه‌ی سریع:
- چیز هایی که انجام شد
- ساختار پوشه
- توکن‌های طراحی
- چک‌لیست اجزاء

---

## 🎯 شروع سریع

### وارد کردن اجزاء:
```typescript
import { Button, Input, Modal, Card, Badge, Alert } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
```

### مثال ساده:
```jsx
<ScreenContainer>
  <Input
    label="نام"
    placeholder="نام خود را وارد کنید"
    value={name}
    onChangeText={setName}
  />

  <Button
    title="ذخیره"
    onPress={handleSave}
    fullWidth
  />
</ScreenContainer>
```

---

## 🎨 اجزاء موجود

### جزء‌های هسته (9)
- 🔘 **Button** - دکمه با 4 تنوع و 3 اندازه
- 📝 **Input** - ورودی متن با اعتبارسنجی
- 📦 **Modal** - دیالوگ مودال
- 🗂️ **FormField** - فیلد فرم پیشرفته
- 🖼️ **ScreenContainer** - ظرف صفحه
- 📇 **Card** - کارت
- 🏷️ **AppHeader** - سرآیند تطبیق
- 📋 **SectionHeader** - سرآیند بخش
- 📊 **MetricTile** - کاشی معیار

### جزء‌های کاربردی (4)
- 🏷️ **Badge** - نشان برای وضعیت
- ⚠️ **Alert** - پیام‌های هشدار/موفقیت
- ➖ **Divider** - جداکننده
- ⏳ **Loading** - شاخص بارگذاری

---

## 🎨 توکن‌های طراحی

### رنگ‌ها
```
اساسی (Accent):    #8fb5ff
متن اساسی:         #f5f7ff
متن ثانویه:        #8ca0ca
پس‌زمینه:          #060816
سطح:              #101830

موفقیت:           #7dd3c7
خطا:             #ff6b6b
هشدار:           #f4c27a
```

### فاصله‌گذاری
```
xs: 4px   sm: 8px   md: 16px   lg: 20px   xl: 24px   2xl: 32px
```

### تایپوگرافی
```
title:    28px
subtitle: 18px
body:     14px
caption:  12px
micro:    11px
```

---

## 💡 نکات مهم

### ✅ همیشه استفاده کنید:

```typescript
// رنگ‌های توکن
backgroundColor: colors.surface

// فاصله‌گذاری توکن
marginBottom: spacing.md

// اندازه فونت توکن
fontSize: typography.body
```

### ❌ این کارها را نکنید:

```typescript
// سخت‌کدگذاری رنگ
backgroundColor: '#101830'

// سخت‌کدگذاری فاصله
marginBottom: 16

// سخت‌کدگذاری اندازه فونت
fontSize: 14
```

---

## 📱 اجزاء پرکاربرد

### دکمه
```jsx
<Button title="ذخیره" />                              // اساسی
<Button title="لغو" variant="secondary" />           // ثانویه
<Button title="حذف" variant="danger" />              // خطر
<Button title="بیشتر" variant="ghost" />             // شفاف
<Button title="ارسال" loading />                     // بارگذاری
<Button title="فعالسازی" disabled />                 // غیرفعال
```

### ورودی
```jsx
<Input label="نام" placeholder="نام خود" />
<Input label="پیام" multiline maxLength={500} showCharCount />
<Input label="ایمیل" error="ایمیل نامعتبر" helperText="نمونه@فارسی.ir" />
```

### مودال
```jsx
<Modal visible={isOpen} title="عنوان" onClose={() => setIsOpen(false)}>
  محتوای مودال
</Modal>
```

### نشان
```jsx
<Badge label="جدید" variant="accent" />
<Badge label="تایید" variant="success" />
<Badge label="هشدار" variant="warning" />
```

---

## 🔧 استفاده از ثابت‌ها

```typescript
import { TRANSITIONS, PADDING, FONT_SIZE, COLOR_GROUPS } from '@/constants/design';

// استفاده
const animationDuration = TRANSITIONS.BASE;
const padding = PADDING.LARGE;
const fontSize = FONT_SIZE.BODY;
const textColor = COLOR_GROUPS.TEXT.PRIMARY;
```

---

## 📖 مثال عملی: فرم ثبت‌نام

```jsx
const [formData, setFormData] = useState({ name: '', email: '' });
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  // اعتبارسنجی
  if (!formData.name.trim()) {
    setErrors({ name: 'نام الزامی است' });
    return;
  }

  setLoading(true);
  try {
    await registerUser(formData);
    Alert.alert('موفق', 'ثبت‌نام موفقیت‌آمیز بود');
  } catch (error) {
    setErrors({ form: 'خطای سرویس' });
  } finally {
    setLoading(false);
  }
};

return (
  <ScreenContainer>
    <AppHeader title="ثبت‌نام" />

    {errors.form && (
      <Alert title="خطا" message={errors.form} variant="error" />
    )}

    <FormField
      label="نام کامل"
      required
      value={formData.name}
      onChangeText={(name) => setFormData({ ...formData, name })}
      error={errors.name}
      placeholder="نام خود را وارد کنید"
    />

    <FormField
      label="ایمیل"
      required
      value={formData.email}
      onChangeText={(email) => setFormData({ ...formData, email })}
      placeholder="ایمیل@نمونه.com"
    />

    <Button
      title="ثبت‌نام"
      onPress={handleSubmit}
      loading={loading}
      fullWidth
    />
  </ScreenContainer>
);
```

---

## 🛠️ مراجع سریع

| فایل | مکان | توضیح |
|------|------|--------|
| پوسته تاریک | `app/src/theme/dark.ts` | تمام توکن‌های رنگی |
| پوسته روشن | `app/src/theme/light.ts` | پوسته‌ی روشن |
| ثابت‌ها | `app/src/constants/design.ts` | توکن‌های طراحی |
| اجزاء | `app/src/components/ui/` | تمام اجزاء |

---

## ⚡ چک‌لیست دسترسی‌پذیری

- [ ] تمام دکمه‌ها حداقل 44x44 اندازه دارند
- [ ] تمام ورودی‌ها برچسب دارند
- [ ] تضاد رنگی کافی (4.5:1)
- [ ] بازخورد برای حالت‌های بارگذاری
- [ ] پیام‌های خطا واضح
- [ ] پشتیبانی صدای تصویر

---

## 📞 سوالات متداول

### س: چطور یک دکمه بزرگ بسازم؟
**ج:** از `size` استفاده کنید:
```jsx
<Button title="بزرگ" size="lg" />
```

### س: چطور error message نمایش دهم؟
**ج:** از `error` prop استفاده کنید:
```jsx
<Input label="ایمیل" error="ایمیل نامعتبر" />
```

### س: چطور یک مودال ایجاد کنم؟
**ج:** Modal جزء استفاده کنید:
```jsx
<Modal visible={isOpen} title="عنوان" onClose={() => setIsOpen(false)}>
  محتوا
</Modal>
```

### س: چطور فاصله‌گذاری صحیح را تنظیم کنم؟
**ج:** از توکن spacing استفاده کنید:
```jsx
marginBottom: spacing.md  // 16px
paddingHorizontal: spacing.lg  // 20px
```

---

## 🎉 کار شما کامل است!

سیستم طراحی شما آماده برای استفاده است. تمام اجزاء:
- ✅ مکمل و تست‌شده
- ✅ دسترسی‌پذیر
- ✅ مستند‌شده (به فارسی!)
- ✅ آماده برای تولید

**اکنون شما می‌توانید:**
1. اجزاء جدید استفاده کنید
2. صفحات جدید بسازید
3. ویژگی‌های جدید اضافه کنید

**سرعت رشد شما افزایش می‌یابد!** 🚀

---

## 📚 منابع بیشتر

- [DESIGN_SYSTEM_FA.md](./DESIGN_SYSTEM_FA.md) - طراحی کامل
- [COMPONENT_GUIDE_FA.md](./COMPONENT_GUIDE_FA.md) - مثال‌های کد
- [DESIGN_SYSTEM_SUMMARY_FA.md](./DESIGN_SYSTEM_SUMMARY_FA.md) - خلاصه

---

**سؤالی دارید؟ کدی نمی‌فهمید؟**
مستندات را بخوانید یا کد را بررسی کنید. همه چیز تفصیلی است! ✨
