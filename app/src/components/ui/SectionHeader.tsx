import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../theme';

type SectionHeaderProps = {
  title: string;
  hint?: string;
};

export function SectionHeader({ title, hint }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '600',
    marginBottom: 2,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
});
