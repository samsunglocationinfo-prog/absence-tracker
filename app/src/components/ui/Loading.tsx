import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

type LoadingProps = {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
};

export function Loading({
  size = 'large',
  color = colors.accent,
  message,
  fullScreen = false,
  style,
}: LoadingProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  message: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
