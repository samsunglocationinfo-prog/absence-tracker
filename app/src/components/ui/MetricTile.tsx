import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type MetricTileProps = {
  value: string;
  label: string;
};

export function MetricTile({ value, label }: MetricTileProps) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: 'rgba(5, 10, 24, 0.28)',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    color: colors.accent,
    fontSize: typography.caption,
    marginTop: 4,
  },
});
