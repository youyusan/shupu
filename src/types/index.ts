export type Direction = 'anchor' | 'genre-variant' | 'theme-neighbor' | 'reader-up' | 'reader-down';

export interface StructuredIdea {
  theme: string;
  genre: string;
  readerProfile: string;
  coreViewpoint: string;
}

export interface BookRecommendation {
  title: string;
  author: string;
  coreSummary: string;
  reason: string;
  direction: Direction;
  isbn?: string;
  coverImage?: string;
  description?: string;
  publishedDate?: string;
  verified: boolean;
}

export interface StructureRequest {
  rawInput: string;
  previousIdea?: StructuredIdea;
  feedback?: string;
}

export interface RecommendRequest {
  structuredIdea: StructuredIdea;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
  };
}

export type ErrorCode =
  | 'INVALID_INPUT'
  | 'AI_SERVICE_ERROR'
  | 'AI_PARSE_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';