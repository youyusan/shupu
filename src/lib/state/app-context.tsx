'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { StructuredIdea, BookRecommendation } from '@/types';
import { ideaStore } from './idea-store';

export type Step = 'home' | 'structured' | 'map';

export interface AppState {
  step: Step;
  rawInput: string;
  structuredIdea: StructuredIdea | null;
  editedIdea: StructuredIdea | null;
  recommendations: BookRecommendation[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_RAW_INPUT'; payload: string }
  | { type: 'SET_STRUCTURED_IDEA'; payload: StructuredIdea }
  | { type: 'SET_EDITED_IDEA'; payload: StructuredIdea }
  | { type: 'SET_RECOMMENDATIONS'; payload: BookRecommendation[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' }
  | { type: 'GO_TO_STEP'; payload: Step };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_RAW_INPUT':
      return { ...state, rawInput: action.payload };
    case 'SET_STRUCTURED_IDEA':
      return { ...state, structuredIdea: action.payload, editedIdea: action.payload };
    case 'SET_EDITED_IDEA':
      return { ...state, editedIdea: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return {
        step: 'home',
        rawInput: '',
        structuredIdea: null,
        editedIdea: null,
        recommendations: [],
        isLoading: false,
        error: null,
      };
    case 'GO_TO_STEP':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    step: 'home',
    rawInput: '',
    structuredIdea: null,
    editedIdea: null,
    recommendations: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const stored = ideaStore.get();
    if (stored.structuredIdea) {
      dispatch({ type: 'SET_STRUCTURED_IDEA', payload: stored.structuredIdea });
      dispatch({ type: 'SET_EDITED_IDEA', payload: stored.structuredIdea });
      dispatch({ type: 'GO_TO_STEP', payload: 'structured' });
    }
    if (stored.rawInput && !stored.structuredIdea) {
      dispatch({ type: 'SET_RAW_INPUT', payload: stored.rawInput });
    }
    if (stored.recommendations) {
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: stored.recommendations });
    }
  }, []);

  useEffect(() => {
    if (state.rawInput || state.structuredIdea || state.recommendations.length > 0) {
      ideaStore.set({
        rawInput: state.rawInput,
        structuredIdea: state.structuredIdea || undefined,
        recommendations: state.recommendations.length > 0 ? state.recommendations : undefined,
      });
    }
  }, [state.rawInput, state.structuredIdea, state.recommendations]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}