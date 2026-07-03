import { useEffect } from 'react';
import { useMemoryStore } from '../store/memoryStore';
import { JournalEntry, MoodType } from '../types/journal';

/**
 * Hook برای استفاده‌ی تمام ورودی‌ها
 * @returns ورودی‌ها، حالت بارگذاری و خطا
 */
export function useMemories() {
  const { entries, isLoading, error, loadEntries } = useMemoryStore();

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return { entries, isLoading, error };
}

/**
 * Hook برای اضافه کردن ورودی جدید
 * @returns تابع اضافه کردن و حالت بارگذاری
 */
export function useAddMemory() {
  const { addEntry, isLoading, error } = useMemoryStore();

  const add = async (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addEntry(data);
  };

  return { addEntry: add, isLoading, error };
}

/**
 * Hook برای بروز رسانی ورودی
 * @returns تابع بروز رسانی و حالت بارگذاری
 */
export function useUpdateMemory() {
  const { updateEntry, isLoading, error } = useMemoryStore();

  const update = async (id: string, updates: Partial<JournalEntry>) => {
    await updateEntry(id, updates);
  };

  return { updateEntry: update, isLoading, error };
}

/**
 * Hook برای حذف ورودی
 * @returns تابع حذف و حالت بارگذاری
 */
export function useDeleteMemory() {
  const { deleteEntry, deleteAllEntries, isLoading, error } = useMemoryStore();

  const remove = async (id: string) => {
    await deleteEntry(id);
  };

  const removeAll = async () => {
    await deleteAllEntries();
  };

  return { deleteEntry: remove, deleteAllEntries: removeAll, isLoading, error };
}

/**
 * Hook برای جستجو در ورودی‌ها
 * @param query متن جستجو
 * @returns ورودی‌های یافت‌شده
 */
export function useSearchMemories(query: string) {
  const { searchEntries } = useMemoryStore();
  return searchEntries(query);
}

/**
 * Hook برای گرفتن ورودی از طریق ID
 * @param id شناسه‌ی ورودی
 * @returns ورودی یا undefined
 */
export function useMemoryById(id: string) {
  const { getEntryById } = useMemoryStore();
  return getEntryById(id);
}

/**
 * Hook برای گرفتن ورودی‌های یک mood خاص
 * @param mood نوع حالت‌ی
 * @returns ورودی‌های مطابق
 */
export function useMemoriesByMood(mood: MoodType) {
  const { getEntriesByMood } = useMemoryStore();
  return getEntriesByMood(mood);
}

/**
 * Hook برای گرفتن ورودی‌های در یک بازه‌ی زمانی
 * @param startDate تاریخ شروع
 * @param endDate تاریخ پایان
 * @returns ورودی‌های در بازه‌ی مشخص
 */
export function useMemoriesInDateRange(startDate: Date, endDate: Date) {
  const { getEntriesInDateRange } = useMemoryStore();
  return getEntriesInDateRange(startDate, endDate);
}

/**
 * Hook برای گرفتن آمار
 * @returns آمار ورودی‌ها
 */
export function useMemoryStats() {
  const { getStats } = useMemoryStore();
  return getStats();
}

/**
 * Hook برای گرفتن آمار mood
 * @returns شمارش mood‌ها
 */
export function useMoodStats() {
  const { getMoodStats } = useMemoryStore();
  return getMoodStats();
}
