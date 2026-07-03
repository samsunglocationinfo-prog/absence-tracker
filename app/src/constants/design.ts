/**
 * Design System Constants
 * Centralized theme, colors, and layout constants
 */

import { colors, radius, spacing, typography, transitions } from '../theme';

// Animations & Transitions
export const TRANSITIONS = {
  FAST: transitions.fast,
  BASE: transitions.base,
  SLOW: transitions.slow,
} as const;

// Component Presets
export const BUTTON_PRESET = {
  SIZES: {
    SMALL: { paddingVertical: spacing.sm - 2, paddingHorizontal: spacing.md },
    MEDIUM: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    LARGE: { paddingVertical: spacing.md - 4, paddingHorizontal: spacing.lg },
  },
} as const;

export const INPUT_PRESET = {
  SIZES: {
    SMALL: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
    MEDIUM: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    LARGE: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md - 4 },
  },
} as const;

// Common Dimensions
export const DIMENSIONS = {
  HEADER_HEIGHT: 56,
  TAB_BAR_HEIGHT: 68,
  TOUCH_TARGET_MIN: 44, // Minimum touch target size for accessibility
  MODAL_MAX_WIDTH: {
    SMALL: 300,
    MEDIUM: 400,
    LARGE: 500,
  },
} as const;

// Gradient Presets
export const GRADIENTS = {
  DEFAULT: ['#060816', '#101830', '#1d2748'],
  SUBTLE: ['#060816', '#0a0f24', '#0f1528'],
  STRONG: ['#000000', '#0d1429', '#1a2d4a'],
} as const;

// Common Shadows (for future elevation system)
export const ELEVATION = {
  NONE: 'none',
  SMALL: '0 2px 4px rgba(0, 0, 0, 0.1)',
  MEDIUM: '0 4px 12px rgba(0, 0, 0, 0.15)',
  LARGE: '0 8px 24px rgba(0, 0, 0, 0.2)',
} as const;

// Color Semantic Groups
export const COLOR_GROUPS = {
  TEXT: {
    PRIMARY: colors.textPrimary,
    SECONDARY: colors.textSecondary,
    TERTIARY: colors.textTertiary,
    MUTED: colors.textTertiary,
  },
  FEEDBACK: {
    SUCCESS: colors.success,
    ERROR: colors.error,
    WARNING: colors.warning,
    INFO: colors.info,
  },
  INTERACTIVE: {
    PRIMARY: colors.accent,
    SECONDARY: colors.accentSoft,
    FOCUS: colors.accentSubtle,
  },
  SURFACE: {
    PRIMARY: colors.surface,
    ELEVATED: colors.surfaceElevated,
    BACKGROUND: colors.background,
  },
  BORDER: {
    DEFAULT: colors.border,
    LIGHT: colors.borderLight,
  },
} as const;

// Utility scale for padding/margin
export const PADDING = {
  NONE: 0,
  XS: spacing.xs,
  SMALL: spacing.sm,
  MEDIUM: spacing.md,
  LARGE: spacing.lg,
  XL: spacing.xl,
  XXL: spacing['2xl'],
} as const;

// Font Sizes
export const FONT_SIZE = {
  MICRO: typography.micro,
  CAPTION: typography.caption,
  BODY: typography.body,
  SUBTITLE: typography.subtitle,
  TITLE: typography.title,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  NONE: 0,
  SMALL: radius.sm,
  MEDIUM: radius.md,
  LARGE: radius.lg,
  XL: radius.xl,
  FULL: radius.full,
} as const;

// Status codes for forms and validation
export const VALIDATION_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  NEUTRAL: 'neutral',
} as const;

// Component variants
export const COMPONENT_VARIANTS = {
  BUTTON: ['primary', 'secondary', 'ghost', 'danger'] as const,
  INPUT: ['default', 'error', 'success', 'warning'] as const,
  BADGE: ['accent', 'success', 'warning', 'error', 'info', 'neutral'] as const,
  ALERT: ['success', 'error', 'warning', 'info'] as const,
} as const;

// Z-index stack for layering
export const Z_INDEX = {
  BASE: 0,
  CARD: 1,
  MODAL_BACKGROUND: 10,
  MODAL: 11,
  TOOLTIP: 20,
  NOTIFICATION: 30,
} as const;
