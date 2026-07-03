import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type InputSize = 'sm' | 'md' | 'lg';

type InputProps = TextInputProps & {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  helperText?: string;
  size?: InputSize;
  multiline?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  placeholder,
  value = '',
  onChangeText,
  error,
  helperText,
  size = 'md',
  multiline = false,
  maxLength,
  showCharCount = false,
  containerStyle,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const charCount = value ? value.length : 0;
  const showCounter = showCharCount && maxLength;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {props.editable !== false && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          styles[`size_${size}`],
          error ? styles.errorBorder : focused ? styles.focusedBorder : styles.defaultBorder,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            styles[`input_${size}`],
            multiline && styles.multilineInput,
            { color: colors.textPrimary },
          ]}
          {...props}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.feedbackContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
        </View>
        {showCounter && (
          <Text style={[styles.charCount, charCount === maxLength && styles.charCountMax]}>
            {charCount}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    marginBottom: spacing.sm,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  required: {
    color: colors.error,
    marginLeft: 2,
  },

  inputWrapper: {
    borderWidth: 1,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },

  defaultBorder: {
    borderColor: colors.border,
  },

  focusedBorder: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(143, 181, 255, 0.06)',
  },

  errorBorder: {
    borderColor: colors.error,
    backgroundColor: colors.errorSubtle,
  },

  size_sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  size_md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  size_lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 4,
  },

  input: {
    fontFamily: 'System',
    fontWeight: '500',
  },

  input_sm: {
    fontSize: typography.caption,
  },

  input_md: {
    fontSize: typography.body,
  },

  input_lg: {
    fontSize: typography.body + 1,
  },

  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingVertical: spacing.md,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    minHeight: 18,
  },

  feedbackContainer: {
    flex: 1,
  },

  errorText: {
    color: colors.error,
    fontSize: typography.micro,
    fontWeight: '500',
  },

  helperText: {
    color: colors.textTertiary,
    fontSize: typography.micro,
    fontWeight: '400',
  },

  charCount: {
    color: colors.textTertiary,
    fontSize: typography.micro,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },

  charCountMax: {
    color: colors.warning,
  },
});
