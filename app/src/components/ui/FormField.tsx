import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Input } from './Input';
import { colors, spacing, typography } from '../../theme';

type FormFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  required?: boolean;
  description?: string;
  containerStyle?: ViewStyle;
};

export function FormField({
  label,
  required = false,
  description,
  containerStyle,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Input {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },

  header: {
    marginBottom: spacing.sm,
  },

  label: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },

  required: {
    color: colors.error,
  },

  description: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '400',
    marginTop: spacing.xs,
  },
});
