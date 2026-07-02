import type { StructuredIdea, BookRecommendation } from '@/types';

export interface IdeaState {
  rawInput: string;
  structuredIdea?: StructuredIdea;
  recommendations?: BookRecommendation[];
}

const STORAGE_KEY = 'bookmap-idea-state';

let memoryState: IdeaState = { rawInput: '' };

function isStorageAvailable(): boolean {
  try {
    const key = '__bookmap_test__';
    sessionStorage.setItem(key, key);
    sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export const ideaStore = {
  get(): IdeaState {
    if (!isStorageAvailable()) {
      return memoryState;
    }
    
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as IdeaState;
        return parsed;
      }
    } catch {
      console.warn('Failed to parse idea state from sessionStorage');
    }
    
    return { rawInput: '' };
  },
  
  set(state: Partial<IdeaState>): void {
    const current = ideaStore.get();
    const newState = { ...current, ...state };
    
    memoryState = newState;
    
    if (isStorageAvailable()) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch {
        console.warn('Failed to save idea state to sessionStorage');
      }
    }
  },
  
  clear(): void {
    memoryState = { rawInput: '' };
    
    if (isStorageAvailable()) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        console.warn('Failed to clear idea state from sessionStorage');
      }
    }
  },
};