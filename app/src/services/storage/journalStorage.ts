import { JournalEntry } from '../../types/journal';
import { readJson, saveJson } from './storage';

const STORAGE_KEY = 'journal-entries';

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const entries = await readJson<JournalEntry[]>(STORAGE_KEY);
  return entries ?? [];
}

export async function saveJournalEntry(entry: JournalEntry) {
  const current = await getJournalEntries();
  const next = [entry, ...current];
  await saveJson(STORAGE_KEY, next);
}

export async function clearJournalEntries() {
  await saveJson(STORAGE_KEY, []);
}
