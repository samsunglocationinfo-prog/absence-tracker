export type ThemeTokens = {
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    accent: string;
    accentSoft: string;
    accentSubtle: string;
    border: string;
    borderLight: string;
    success: string;
    successSubtle: string;
    error: string;
    errorSubtle: string;
    warning: string;
    warningSubtle: string;
    info: string;
    infoSubtle: string;
  };
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>;
  typography: Record<'title' | 'subtitle' | 'body' | 'caption' | 'micro', number>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl' | 'full', number>;
  shadows: Record<'sm' | 'md' | 'lg', string>;
  transitions: Record<'fast' | 'base' | 'slow', number>;
};
