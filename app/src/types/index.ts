export type ThemeMode = 'light' | 'dark';

export type TimePerspective = {
  key: string;
  label: string;
  value: string;
};

export type MemoryEntry = {
  id: string;
  date: string;
  text: string;
  mood?: string;
  weather?: string;
  location?: string;
  tags?: string[];
  createdAt: string;
};

export type CounterMetric = {
  id: string;
  key: string;
  label: string;
  value: number;
  enabled: boolean;
  createdAt: string;
};
