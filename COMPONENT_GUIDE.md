# Component Usage Guide — Absence Tracker

A practical guide to using components from the design system with real-world examples.

## Quick Start

### Import Components

```typescript
import { Button, Input, Card, Modal, Alert, Badge } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
```

### Import Constants

```typescript
import { PADDING, FONT_SIZE, TRANSITIONS, COMPONENT_VARIANTS } from '@/constants/design';
```

---

## Common Patterns

### 1. Form with Validation

```jsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

const validateEmail = (text: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(text);
};

const handleSubmit = async () => {
  if (!validateEmail(email)) {
    setEmailError('Invalid email address');
    return;
  }

  setIsSubmitting(true);
  try {
    // API call
    await submitEmail(email);
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <>
    <Input
      label="Email Address"
      placeholder="your@email.com"
      value={email}
      onChangeText={(text) => {
        setEmail(text);
        setEmailError('');
      }}
      error={emailError}
      helperText="We'll never share your email"
      required
    />
    <Button
      title="Subscribe"
      onPress={handleSubmit}
      loading={isSubmitting}
      fullWidth
    />
  </>
);
```

### 2. Modal with Form

```jsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });

const handleSave = async () => {
  // Validate
  if (!formData.name || !formData.email) {
    // Show error
    return;
  }

  // Save
  await saveData(formData);
  setIsOpen(false);
  setFormData({ name: '', email: '' });
};

return (
  <>
    <Button title="Create" onPress={() => setIsOpen(true)} />

    <Modal
      visible={isOpen}
      title="New Entry"
      subtitle="Fill in the details below"
      onClose={() => setIsOpen(false)}
      footer={
        <View style={{ flexDirection: 'column', gap: spacing.md }}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => setIsOpen(false)}
            fullWidth
          />
          <Button title="Save" onPress={handleSave} fullWidth />
        </View>
      }
    >
      <Input
        label="Name"
        placeholder="John Doe"
        value={formData.name}
        onChangeText={(name) => setFormData({ ...formData, name })}
      />
      <Input
        label="Email"
        placeholder="john@example.com"
        value={formData.email}
        onChangeText={(email) => setFormData({ ...formData, email })}
      />
    </Modal>
  </>
);
```

### 3. List with Status Badges

```jsx
const items = [
  { id: 1, title: 'Task A', status: 'completed' },
  { id: 2, title: 'Task B', status: 'pending' },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, 'success' | 'warning' | 'error'> = {
    completed: 'success',
    pending: 'warning',
    failed: 'error',
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

### 4. Error and Success States

```jsx
const [state, setState] = useState('idle'); // idle | loading | success | error

const handleAction = async () => {
  setState('loading');
  try {
    await performAction();
    setState('success');
    // Reset after 2 seconds
    setTimeout(() => setState('idle'), 2000);
  } catch (error) {
    setState('error');
  }
};

return (
  <>
    {state === 'success' && (
      <Alert
        title="Success!"
        message="Your changes have been saved."
        variant="success"
      />
    )}

    {state === 'error' && (
      <Alert
        title="Something went wrong"
        message="Please try again later."
        variant="error"
      />
    )}

    <Button
      title="Save"
      onPress={handleAction}
      loading={state === 'loading'}
      disabled={state === 'loading'}
      fullWidth
    />
  </>
);
```

### 5. Multi-step Form

```jsx
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  step1: {},
  step2: {},
  step3: {},
});

const steps = [
  { title: 'Personal Info', subtitle: 'Tell us about yourself' },
  { title: 'Preferences', subtitle: 'Choose your settings' },
  { title: 'Confirmation', subtitle: 'Review and confirm' },
];

const handleNext = () => {
  // Validate current step
  if (validateStep(step)) {
    setStep((s) => Math.min(s + 1, steps.length));
  }
};

const handleBack = () => {
  setStep((s) => Math.max(s - 1, 1));
};

return (
  <ScreenContainer>
    <AppHeader title={steps[step - 1].title} subtitle={steps[step - 1].subtitle} />

    {/* Step indicators */}
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

    {/* Form content */}
    <View style={{ flex: 1 }}>
      {step === 1 && <Step1Form data={formData.step1} onChange={(data) => setFormData({ ...formData, step1: data })} />}
      {step === 2 && <Step2Form data={formData.step2} onChange={(data) => setFormData({ ...formData, step2: data })} />}
      {step === 3 && <Step3Review data={formData} />}
    </View>

    {/* Navigation buttons */}
    <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
      <Button
        title="Back"
        variant="secondary"
        onPress={handleBack}
        disabled={step === 1}
        fullWidth
      />
      <Button
        title={step === steps.length ? 'Submit' : 'Next'}
        onPress={step === steps.length ? handleSubmit : handleNext}
        fullWidth
      />
    </View>
  </ScreenContainer>
);
```

---

## Styling Best Practices

### ✅ DO

```jsx
// Use theme tokens
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
});

// Use typography tokens
<Text style={{ fontSize: typography.body, color: colors.textPrimary }}>

// Use spacing scale
marginBottom: spacing.md
paddingHorizontal: spacing.lg

// Use color groups
backgroundColor: colors.accentSubtle
```

### ❌ DON'T

```jsx
// Don't hardcode values
padding: 20
borderRadius: 12
marginBottom: 16

// Don't hardcode colors
backgroundColor: '#8fb5ff'
color: '#f5f7ff'

// Don't use arbitrary values
marginBottom: 15
paddingHorizontal: 18
```

---

## Responsive Layout

### Screen sizes

```typescript
const screenWidth = useWindowDimensions().width;

const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
const isLargeScreen = screenWidth >= 768;
```

### Flexible layouts

```jsx
// Use flex for responsive layouts
<View style={{ flexDirection: 'row', flex: 1 }}>
  <View style={{ flex: 1 }}>Left</View>
  <View style={{ flex: 2 }}>Right (2x width)</View>
</View>

// Use gap for consistent spacing
<View style={{ flexDirection: 'column', gap: spacing.md }}>
  {items.map(item => <Item key={item.id} />)}
</View>
```

---

## Accessibility Guidelines

### 1. Touch Targets

All interactive elements should have minimum 44x44 points size:

```jsx
<Pressable style={{ minWidth: 44, minHeight: 44 }}>
  <Text>Tap me</Text>
</Pressable>
```

### 2. Color Contrast

Ensure sufficient contrast ratio (WCAG AA: 4.5:1 for text):

```jsx
// ✅ Good contrast
<Text style={{ color: colors.textPrimary }}>Text on background</Text>

// ❌ Poor contrast
<Text style={{ color: colors.textTertiary, fontSize: 10 }}>Too light</Text>
```

### 3. Labels for Inputs

```jsx
// ✅ Always include label
<Input label="Email" placeholder="..." />

// ❌ Never rely on placeholder alone
<TextInput placeholder="Email" />
```

### 4. Semantic Structure

```jsx
// ✅ Use semantic components
<Button title="Submit" />
<Input label="Name" />
<Card>Content</Card>

// ❌ Avoid
<Pressable><Text>Submit</Text></Pressable>
<TextInput />
<View>Content</View>
```

---

## Performance Tips

### 1. Memoization

```jsx
import { memo } from 'react';

const ListItem = memo(({ item, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <Text>{item.title}</Text>
  </Pressable>
));
```

### 2. FlatList for Long Lists

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

### 3. Avoid Inline Objects

```jsx
// ❌ Creates new object on every render
<Button style={{ marginBottom: spacing.md }} />

// ✅ Define once
const buttonStyle = { marginBottom: spacing.md };
<Button style={buttonStyle} />
```

---

## Troubleshooting

### Button not responding to presses

- Ensure `onPress` is defined
- Check if parent has `pointerEvents="none"`
- Verify `disabled` prop is not true

### Input text not visible

- Check text color vs background contrast
- Verify font size is not too small
- Ensure input has sufficient height

### Modal not showing

- Verify `visible={true}`
- Check if parent component is rendering
- Ensure no z-index issues

### Styling not applied

- Verify imports are from correct path
- Check StyleSheet syntax
- Ensure component accepts `style` prop

---

## Resources

- [Design System Documentation](./DESIGN_SYSTEM.md)
- [Theme Configuration](./app/src/theme/dark.ts)
- [Components Index](./app/src/components/ui/index.ts)
- [Design Constants](./app/src/constants/design.ts)
