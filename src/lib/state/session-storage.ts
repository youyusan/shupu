import type { StructuredIdea, BookRecommendation } from '@/types';

interface StoredData {
  rawInput: string;
  structuredIdea?: StructuredIdea;
  editedIdea?: StructuredIdea;
  recommendations?: BookRecommendation[];
  step?: string;
}

const STORAGE_KEY = 'shupu-idea-data';

let storageAvailable: boolean | null = null;

function isStorageAvailable(): boolean {
  if (storageAvailable !== null) return storageAvailable;

  try {
    const testKey = '__shupu_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }

  return storageAvailable;
}

let memoryStore: StoredData = {
  rawInput: '',
};

export function getStoredData(): StoredData {
  if (!isStorageAvailable()) {
    return { ...memoryStore };
  }

  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { rawInput: '' };
  } catch {
    return { rawInput: '' };
  }
}

export function setStoredData(data: Partial<StoredData>): void {
  const current = getStoredData();
  const updated = { ...current, ...data };

  if (!isStorageAvailable()) {
    memoryStore = updated;
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    memoryStore = updated;
  }
}

export function clearStoredData(): void {
  if (!isStorageAvailable()) {
    memoryStore = { rawInput: '' };
    return;
  }

  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    memoryStore = { rawInput: '' };
  }
}