/**
 * ثابت‌های سیستم طراحی
 * توکن‌های پوسته، رنگ و ثابت‌های طراحی متمرکز
 */

import { colors, radius, spacing, typography, transitions } from '../theme';

// انیمیشن‌ها و انتقال‌ها
export const TRANSITIONS = {
  FAST: transitions.fast,      // بازخورد سریع (150ms)
  BASE: transitions.base,      // انیمیشن استاندارد (250ms)
  SLOW: transitions.slow,      // انتقال خاکستری (350ms)
} as const;

// پیش‌تنظیم‌های جزء
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

// ابعاد رایج
export const DIMENSIONS = {
  HEADER_HEIGHT: 56,          // ارتفاع سرآیند
  TAB_BAR_HEIGHT: 68,         // ارتفاع نوار زبانه
  TOUCH_TARGET_MIN: 44,       // حداقل اندازه هدف لمسی برای دسترسی‌پذیری
  MODAL_MAX_WIDTH: {
    SMALL: 300,               // عرض حداکثر مودال کوچک
    MEDIUM: 400,              // عرض حداکثر مودال متوسط
    LARGE: 500,               // عرض حداکثر مودال بزرگ
  },
} as const;

// پیش‌تنظیم‌های گرادیان
export const GRADIENTS = {
  DEFAULT: ['#060816', '#101830', '#1d2748'],      // گرادیان پیش‌فرض
  SUBTLE: ['#060816', '#0a0f24', '#0f1528'],       // گرادیان ظریف
  STRONG: ['#000000', '#0d1429', '#1a2d4a'],       // گرادیان قوی
} as const;

// سیستم سایه برای ایجاد عمق
export const ELEVATION = {
  NONE: 'none',
  SMALL: '0 2px 4px rgba(0, 0, 0, 0.1)',
  MEDIUM: '0 4px 12px rgba(0, 0, 0, 0.15)',
  LARGE: '0 8px 24px rgba(0, 0, 0, 0.2)',
} as const;

// گروه‌های رنگی برای کاربردهای مختلف
export const COLOR_GROUPS = {
  TEXT: {
    PRIMARY: colors.textPrimary,       // متن اساسی
    SECONDARY: colors.textSecondary,   // متن ثانویه
    TERTIARY: colors.textTertiary,     // متن سوم
    MUTED: colors.textTertiary,        // متن خافت‌شده
  },
  FEEDBACK: {
    SUCCESS: colors.success,           // بازخورد موفقیت
    ERROR: colors.error,               // بازخورد خطا
    WARNING: colors.warning,           // بازخورد هشدار
    INFO: colors.info,                 // بازخورد اطلاع
  },
  INTERACTIVE: {
    PRIMARY: colors.accent,            // عنصر تعاملی اساسی
    SECONDARY: colors.accentSoft,      // عنصر تعاملی ثانویه
    FOCUS: colors.accentSubtle,        // حالت فوکوس
  },
  SURFACE: {
    PRIMARY: colors.surface,           // سطح اساسی
    ELEVATED: colors.surfaceElevated,  // سطح بالاتر
    BACKGROUND: colors.background,    // پس‌زمینه
  },
  BORDER: {
    DEFAULT: colors.border,            // مرز استاندارد
    LIGHT: colors.borderLight,         // مرز سبک
  },
} as const;

// مقیاس کاربردی برای الف و حاشیه
export const PADDING = {
  NONE: 0,
  XS: spacing.xs,
  SMALL: spacing.sm,
  MEDIUM: spacing.md,
  LARGE: spacing.lg,
  XL: spacing.xl,
  XXL: spacing['2xl'],
} as const;

// اندازه‌های فونت
export const FONT_SIZE = {
  MICRO: typography.micro,     // بسیار کوچک
  CAPTION: typography.caption,  // برچسب
  BODY: typography.body,        // متن بدن
  SUBTITLE: typography.subtitle, // زیرعنوان
  TITLE: typography.title,      // عنوان
} as const;

// شعاع مرز
export const BORDER_RADIUS = {
  NONE: 0,
  SMALL: radius.sm,
  MEDIUM: radius.md,
  LARGE: radius.lg,
  XL: radius.xl,
  FULL: radius.full,
} as const;

// کدهای وضعیت برای فرم‌ها و اعتبارسنجی
export const VALIDATION_STATUS = {
  SUCCESS: 'success',   // موفقیت
  ERROR: 'error',       // خطا
  WARNING: 'warning',   // هشدار
  INFO: 'info',         // اطلاع
  NEUTRAL: 'neutral',   // خنثی
} as const;

// تنوع‌های جزء
export const COMPONENT_VARIANTS = {
  BUTTON: ['primary', 'secondary', 'ghost', 'danger'] as const,
  INPUT: ['default', 'error', 'success', 'warning'] as const,
  BADGE: ['accent', 'success', 'warning', 'error', 'info', 'neutral'] as const,
  ALERT: ['success', 'error', 'warning', 'info'] as const,
} as const;

// ترتیب z-index برای لایه‌بندی
export const Z_INDEX = {
  BASE: 0,              // پایه
  CARD: 1,              // کارت
  MODAL_BACKGROUND: 10, // پس‌زمینه مودال
  MODAL: 11,            // مودال
  TOOLTIP: 20,          // راهنمای ابزار
  NOTIFICATION: 30,     // اعلان
} as const;
