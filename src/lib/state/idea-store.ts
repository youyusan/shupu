import type { StructuredIdea, BookRecommendation } from '@/types';
import { getStoredData, setStoredData, clearStoredData } from './session-storage';

interface IdeaStoreData {
  rawInput: string;
  structuredIdea?: StructuredIdea;
  editedIdea?: StructuredIdea;
  recommendations?: BookRecommendation[];
}

export const ideaStore = {
  get(): IdeaStoreData {
    return getStoredData();
  },

  set(data: Partial<IdeaStoreData>): void {
    setStoredData(data);
  },

  clear(): void {
    clearStoredData();
  },
};