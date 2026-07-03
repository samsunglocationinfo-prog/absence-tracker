import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../theme';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: 'default' | 'subtle' | 'strong';
  padding?: boolean;
};

export function ScreenContainer({
  children,
  style,
  gradient = 'default',
  padding = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const gradientColors = {
    default: ['#060816', '#101830', '#1d2748'],
    subtle: ['#060816', '#0a0f24', '#0f1528'],
    strong: ['#000000', '#0d1429', '#1a2d4a'],
  };

  return (
    <LinearGradient
      colors={gradientColors[gradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: padding ? insets.top + spacing.lg : insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: padding ? spacing.lg : 0,
            paddingRight: padding ? spacing.lg : 0,
          },
          style,
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
