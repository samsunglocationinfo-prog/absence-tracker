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

## Color Palette

### Primary Colors

| Name | Value | Usage |
|------|-------|-------|
| **Accent** | `#8fb5ff` | Interactive elements, highlights |
| **Accent Soft** | `#84a6dc` | Secondary interactive elements |
| **Accent Subtle** | `rgba(143, 181, 255, 0.12)` | Background highlights |

### Text Colors

| Name | Value | Usage |
|------|-------|-------|
| **Text Primary** | `#f5f7ff` | Main text, headings |
| **Text Secondary** | `#8ca0ca` | Secondary text, labels |
| **Text Tertiary** | `#5d6b93` | Placeholder, muted text |

### Surface Colors

| Name | Value | Usage |
|------|-------|-------|
| **Background** | `#060816` | Main screen background |
| **Surface** | `#101830` | Cards, containers |
| **Surface Elevated** | `#1d2748` | Elevated layers |

### Semantic Colors

| Name | Usage | Colors |
|------|-------|--------|
| **Success** | Success states | `#7dd3c7` (main), `rgba(..., 0.12)` (subtle) |
| **Error** | Error states | `#ff6b6b` (main), `rgba(..., 0.12)` (subtle) |
| **Warning** | Warning states | `#f4c27a` (main), `rgba(..., 0.12)` (subtle) |
| **Info** | Informational | `#6db3f2` (main), `rgba(..., 0.12)` (subtle) |

### Borders

| Name | Value | Usage |
|------|-------|-------|
| **Border** | `rgba(255,255,255,0.12)` | Standard borders |
| **Border Light** | `rgba(255,255,255,0.06)` | Subtle dividers |

---

## Spacing Scale

```javascript
xs:   4px    // Extra small gaps
sm:   8px    // Small gaps, padding
md:  16px    // Default, standard margins
lg:  20px    // Large spacing
xl:  24px    // Extra large sections
2xl: 32px    // Full section spacing
```

Use `spacing` token for all margins and padding.

---

## Typography

```javascript
title:    28px  // Screen titles, major headings
subtitle: 18px  // Section headers
body:     14px  // Main text
caption:  12px  // Labels, helper text
micro:    11px  // Badge text, very small
```

All typography uses 600-700 `fontWeight` for headings, 500 for body.

---

## Border Radius

```javascript
sm:   8px     // Small elements
md:  12px     // Buttons, inputs (default)
lg:  16px     // Cards, modals
xl:  24px     // Large containers
full: 9999px  // Badges, pills
```

---

## Components

### Button

A versatile button component with multiple variants and sizes.

#### Props

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

#### Variants

```jsx
// Primary (default)
<Button title="Save" variant="primary" />

// Secondary
<Button title="Cancel" variant="secondary" />

// Ghost
<Button title="Learn more" variant="ghost" />

// Danger
<Button title="Delete" variant="danger" />
```

#### Sizes

```jsx
<Button title="Small" size="sm" />
<Button title="Medium" size="md" />     // default
<Button title="Large" size="lg" />
```

#### States

```jsx
// Loading
<Button title="Save" loading />

// Disabled
<Button title="Save" disabled />

// Full width
<Button title="Save" fullWidth />
```

---

### Input

A flexible input component with error handling and validation states.

#### Props

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

#### Basic Usage

```jsx
<Input
  label="Email"
  placeholder="your@email.com"
  value={email}
  onChangeText={setEmail}
/>
```

#### With Validation

```jsx
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  error={passwordError ? "Password is required" : undefined}
  helperText="At least 8 characters"
/>
```

#### Multiline

```jsx
<Input
  label="Message"
  multiline
  value={message}
  onChangeText={setMessage}
  maxLength={500}
  showCharCount
/>
```

#### Sizes

```jsx
<Input size="sm" label="Small" />
<Input size="md" label="Medium" />   // default
<Input size="lg" label="Large" />
```

---

### Modal

A customizable modal dialog with optional footer and scrolling.

#### Props

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

#### Basic Usage

```jsx
<Modal
  visible={modalVisible}
  title="Create Memory"
  onClose={() => setModalVisible(false)}
>
  <Input label="Title" />
  <Input label="Content" multiline />
</Modal>
```

#### With Footer

```jsx
<Modal
  visible={modalVisible}
  title="Confirm Action"
  onClose={() => setModalVisible(false)}
  footer={
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Button title="Cancel" variant="secondary" onPress={() => setModalVisible(false)} fullWidth />
      <Button title="Confirm" onPress={handleConfirm} fullWidth />
    </View>
  }
>
  <Text>Are you sure?</Text>
</Modal>
```

#### Sizes

```jsx
<Modal size="sm" title="Small" />      // 300px max
<Modal size="md" title="Medium" />     // 400px max (default)
<Modal size="lg" title="Large" />      // 500px max
<Modal size="full" title="Full" />     // Full width
```

---

### FormField

A wrapper that combines label, input, and helper text for cleaner form structures.

#### Props

```typescript
type FormFieldProps = InputProps & {
  label: string;
  required?: boolean;
  description?: string;
  containerStyle?: ViewStyle;
};
```

#### Usage

```jsx
<FormField
  label="Full Name"
  placeholder="John Doe"
  required
  description="Your legal name"
  value={name}
  onChangeText={setName}
/>
```

---

### Badge

A small label component for tags, status indicators, and categories.

#### Props

```typescript
type BadgeProps = {
  label: string;
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
};
```

#### Usage

```jsx
<Badge label="New" variant="accent" />
<Badge label="Approved" variant="success" />
<Badge label="Pending" variant="warning" />
<Badge label="Failed" variant="error" />
```

---

### Alert

An informational box for displaying important messages.

#### Props

```typescript
type AlertProps = {
  title: string;
  message?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  style?: ViewStyle;
};
```

#### Usage

```jsx
<Alert
  title="Memory saved"
  message="Your reflection has been stored securely."
  variant="success"
/>

<Alert
  title="Validation error"
  message="Please fill in all required fields."
  variant="error"
/>
```

---

### Divider

A visual separator for grouping content.

#### Props

```typescript
type DividerProps = {
  vertical?: boolean;
  style?: ViewStyle;
  color?: string;
};
```

#### Usage

```jsx
// Horizontal (default)
<Divider />

// Vertical
<Divider vertical />

// Custom color
<Divider color={colors.error} />
```

---

### Loading

A centered loading indicator with optional message.

#### Props

```typescript
type LoadingProps = {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
};
```

#### Usage

```jsx
<Loading message="Loading memories..." />
<Loading fullScreen message="Please wait..." />
```

---

### ScreenContainer

A wrapper that provides consistent background, safe area insets, and padding for screens.

#### Props

```typescript
type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: 'default' | 'subtle' | 'strong';
  padding?: boolean;
};
```

#### Usage

```jsx
<ScreenContainer>
  <AppHeader title="Timeline" />
  <Content />
</ScreenContainer>

// With custom gradient
<ScreenContainer gradient="subtle">
  {/* content */}
</ScreenContainer>
```

---

## Best Practices

### 1. **Spacing & Alignment**

Always use the spacing scale:

```jsx
// ✅ Good
style={{ marginBottom: spacing.md, paddingHorizontal: spacing.lg }}

// ❌ Avoid
style={{ marginBottom: 16, paddingHorizontal: 20 }}
```

### 2. **Typography**

Use consistent text styles:

```jsx
// ✅ Good
<Text style={{ fontSize: typography.body, color: colors.textPrimary }}>

// ❌ Avoid
<Text style={{ fontSize: 14, color: '#fff' }}>
```

### 3. **Colors**

Reference theme colors instead of hardcoding:

```jsx
// ✅ Good
style={{ borderColor: colors.border }}

// ❌ Avoid
style={{ borderColor: 'rgba(255,255,255,0.12)' }}
```

### 4. **Form Validation**

Always validate and provide feedback:

```jsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={!isValidEmail(email) ? "Invalid email" : undefined}
/>
```

### 5. **Accessibility**

- All interactive elements should have adequate touch targets (44x44 minimum)
- Labels should be provided for all inputs
- Use semantic color (not just color for meaning)
- Test with screen readers

### 6. **Performance**

- Memoize components that receive props from parent
- Avoid inline style objects
- Use ScrollView with showsVerticalScrollIndicator={false} when appropriate

---

## Transitions & Motion

Standard transition times:

```javascript
fast: 150ms   // Quick feedback
base: 250ms   // Standard animations
slow: 350ms   // Elegant transitions
```

---

## Export & Usage

All components are exported from `src/components/ui/index.ts`:

```jsx
import { Button, Input, Modal, Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
```

---

## Future Enhancements

- [ ] Theme switching (light/dark modes)
- [ ] RTL support for Urdu/Persian
- [ ] Localization system
- [ ] Component storybook
- [ ] Animations & transitions library
- [ ] Haptic feedback support
