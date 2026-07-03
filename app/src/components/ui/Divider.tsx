import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

type DividerProps = {
  vertical?: boolean;
  style?: ViewStyle;
  color?: string;
};

export function Divider({ vertical = false, style, color = colors.borderLight }: DividerProps) {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { [vertical ? 'borderLeftColor' : 'borderTopColor']: color },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    borderTopWidth: 1,
    width: '100%',
    marginVertical: spacing.md,
  },

  vertical: {
    borderLeftWidth: 1,
    height: '100%',
    marginHorizontal: spacing.md,
  },
});
