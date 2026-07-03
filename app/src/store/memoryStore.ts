import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, JournalStats, MoodType } from '../types/journal';

type MemoryStore = {
  // حالت
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;

  // اقدامات اساسی
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  deleteAllEntries: () => Promise<void>;

  // جستجو و فیلتر
  getEntryById: (id: string) => JournalEntry | undefined;
  searchEntries: (query: string) => JournalEntry[];
  getEntriesByMood: (mood: MoodType) => JournalEntry[];
  getEntriesInDateRange: (startDate: Date, endDate: Date) => JournalEntry[];

  // آمار
  getStats: () => JournalStats;
  getMoodStats: () => Record<MoodType, number>;

  // بارگذاری
  loadEntries: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useMemoryStore = create<MemoryStore>()(
  persist(
    (set, get) => ({
      // حالت اولیه
      entries: [],
      isLoading: false,
      error: null,

      // اضافه کردن ورودی جدید
      addEntry: async (entryData) => {
        try {
          set({ isLoading: true, error: null });
          const now = new Date().toISOString();
          const newEntry: JournalEntry = {
            ...entryData,
            id: `${Date.now()}`,
            createdAt: now,
            updatedAt: now,
          };

          set((state) => ({
            entries: [newEntry, ...state.entries],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: 'خطا در ذخیره‌سازی ورودی',
            isLoading: false,
          });
        }
      },

      // بروز رسانی ورودی
      updateEntry: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const now = new Date().toISOString();

          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === id
                ? { ...entry, ...updates, updatedAt: now }
                : entry
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: 'خطا در بروز رسانی ورودی',
            isLoading: false,
          });
        }
      },

      // حذف ورودی
      deleteEntry: async (id) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            entries: state.entries.filter((entry) => entry.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: 'خطا در حذف ورودی',
            isLoading: false,
          });
        }
      },

      // حذف تمام ورودی‌ها
      deleteAllEntries: async () => {
        try {
          set({ isLoading: true, error: null });
          set({ entries: [], isLoading: false });
        } catch (error) {
          set({
            error: 'خطا در حذف تمام ورودی‌ها',
            isLoading: false,
          });
        }
      },

      // گرفتن ورودی از طریق ID
      getEntryById: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },

      // جستجو در ورودی‌ها
      searchEntries: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(lowerQuery) ||
            entry.reflection.toLowerCase().includes(lowerQuery) ||
            entry.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },

      // فیلتر کردن بر اساس mood
      getEntriesByMood: (mood) => {
        return get().entries.filter((entry) => entry.mood === mood);
      },

      // فیلتر کردن بر اساس بازه‌ی زمانی
      getEntriesInDateRange: (startDate, endDate) => {
        return get().entries.filter((entry) => {
          const entryDate = new Date(entry.createdAt);
          return entryDate >= startDate && entryDate <= endDate;
        });
      },

      // گرفتن آمار
      getStats: () => {
        const entries = get().entries;
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const moodCounts: Record<MoodType, number> = {
          آرام: 0,
          خوشحال: 0,
          غمگین: 0,
          نگران: 0,
          خسته: 0,
          'انرژی دار': 0,
        };

        entries.forEach((entry) => {
          if (moodCounts.hasOwnProperty(entry.mood)) {
            moodCounts[entry.mood]++;
          }
        });

        return {
          totalEntries: entries.length,
          lastEntry: entries[0],
          moodCounts,
          entriesThisMonth: get()
            .getEntriesInDateRange(thisMonth, now)
            .length,
          entriesThisWeek: get()
            .getEntriesInDateRange(thisWeek, now)
            .length,
        };
      },

      // آمار mood
      getMoodStats: () => {
        const moodCounts: Record<MoodType, number> = {
          آرام: 0,
          خوشحال: 0,
          غمگین: 0,
          نگران: 0,
          خسته: 0,
          'انرژی دار': 0,
        };

        get().entries.forEach((entry) => {
          if (moodCounts.hasOwnProperty(entry.mood)) {
            moodCounts[entry.mood]++;
          }
        });

        return moodCounts;
      },

      // بارگذاری ورودی‌ها
      loadEntries: async () => {
        try {
          set({ isLoading: true, error: null });
          // Zustand persist middleware خودکار بارگذاری می‌کند
          // این تابع برای تأیید است
          set({ isLoading: false });
        } catch (error) {
          set({
            error: 'خطا در بارگذاری ورودی‌ها',
            isLoading: false,
          });
        }
      },

      // تنظیم خطا
      setError: (error) => set({ error }),

      // تنظیم حالت بارگذاری
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'memory-store',
      storage: {
        getItem: async (name: string) => {
          try {
            const item = await AsyncStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch (error) {
            console.error('خطا در خواندن از AsyncStorage:', error);
            return null;
          }
        },
        setItem: async (name: string, value: any) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('خطا در نوشتن به AsyncStorage:', error);
          }
        },
        removeItem: async (name: string) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('خطا در حذف از AsyncStorage:', error);
          }
        },
      },
      partialize: (state) => ({
        entries: state.entries,
      }),
    }
  )
);
