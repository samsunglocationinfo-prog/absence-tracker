import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

type AlertProps = {
  title: string;
  message?: string;
  variant?: AlertVariant;
  style?: ViewStyle;
};

export function Alert({ title, message, variant = 'info', style }: AlertProps) {
  const variantConfig = {
    success: {
      backgroundColor: colors.successSubtle,
      borderColor: colors.success,
      titleColor: colors.success,
    },
    error: {
      backgroundColor: colors.errorSubtle,
      borderColor: colors.error,
      titleColor: colors.error,
    },
    warning: {
      backgroundColor: colors.warningSubtle,
      borderColor: colors.warning,
      titleColor: colors.warning,
    },
    info: {
      backgroundColor: colors.infoSubtle,
      borderColor: colors.info,
      titleColor: colors.info,
    },
  };

  const config = variantConfig[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        style,
      ]}
    >
      <Text style={[styles.title, { color: config.titleColor }]}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  title: {
    fontSize: typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },

  message: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '400',
    lineHeight: 18,
  },
});
