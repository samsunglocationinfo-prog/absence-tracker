import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.accent : '#fff'} />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`text_${size}`]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    gap: spacing.sm,
  },

  // Sizes
  sm: {
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  lg: {
    paddingVertical: spacing.md - 4,
    paddingHorizontal: spacing.lg,
  },

  // Variants
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.borderLight,
  },
  danger: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  accent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },

  // Text
  label: {
    fontWeight: '600',
  },
  label_primary: {
    color: '#fff',
  },
  label_secondary: {
    color: colors.textPrimary,
  },
  label_ghost: {
    color: colors.accent,
  },
  label_danger: {
    color: '#fff',
  },
  label_accent: {
    color: '#fff',
  },

  text_sm: {
    fontSize: typography.caption,
  },
  text_md: {
    fontSize: typography.body,
  },
  text_lg: {
    fontSize: typography.subtitle - 4,
  },

  fullWidth: {
    width: '100%',
  },
});
