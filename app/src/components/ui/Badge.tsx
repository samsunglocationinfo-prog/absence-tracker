import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type BadgeVariant = 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
};

export function Badge({ label, variant = 'accent', size = 'sm', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  size_sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
  },

  size_md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  // Variants
  accent: {
    backgroundColor: colors.accentSubtle,
  },

  success: {
    backgroundColor: colors.successSubtle,
  },

  warning: {
    backgroundColor: colors.warningSubtle,
  },

  error: {
    backgroundColor: colors.errorSubtle,
  },

  info: {
    backgroundColor: colors.infoSubtle,
  },

  neutral: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  text: {
    fontWeight: '600',
  },

  text_accent: {
    color: colors.accent,
    fontSize: typography.micro,
  },

  text_success: {
    color: colors.success,
    fontSize: typography.micro,
  },

  text_warning: {
    color: colors.warning,
    fontSize: typography.micro,
  },

  text_error: {
    color: colors.error,
    fontSize: typography.micro,
  },

  text_info: {
    color: colors.info,
    fontSize: typography.micro,
  },

  text_neutral: {
    color: colors.textSecondary,
    fontSize: typography.micro,
  },
});
