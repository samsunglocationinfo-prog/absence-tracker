import React from 'react';
import { Modal as RNModal, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type ModalSize = 'sm' | 'md' | 'lg' | 'full';

type ModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  footer?: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
};

export function Modal({
  visible,
  title,
  subtitle,
  onClose,
  children,
  size = 'md',
  footer,
  scrollable = true,
  contentContainerStyle,
}: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.card, styles[`size_${size}`]]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          {scrollable ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[styles.content, contentContainerStyle]}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.content, contentContainerStyle]}>{children}</View>
          )}

          {footer && <View style={styles.footer}>{footer}</View>}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(2, 4, 10, 0.72)',
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '90%',
    flexDirection: 'column',
  },

  size_sm: {
    width: '80%',
    maxWidth: 300,
  },

  size_md: {
    width: '90%',
    maxWidth: 400,
  },

  size_lg: {
    width: '95%',
    maxWidth: 500,
  },

  size_full: {
    width: '100%',
    maxHeight: '95%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  headerContent: {
    flex: 1,
    paddingRight: spacing.lg,
  },

  title: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '400',
  },

  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -spacing.sm,
  },

  close: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: 'rgba(255,255,255,0.02)',
    gap: spacing.md,
  },
});
