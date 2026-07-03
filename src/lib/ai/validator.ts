import { z } from 'zod';

export const structuredIdeaSchema = z.object({
  theme: z.string().min(1).max(30),
  genre: z.string().min(1).max(30),
  readerProfile: z.string().min(1).max(30),
  coreViewpoint: z.string().min(1).max(100),
});

export const bookRecommendationSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  coreSummary: z.string().min(10).max(500),
  reason: z.string().min(10).max(200),
  direction: z.enum(['anchor', 'genre-variant', 'theme-neighbor', 'reader-up', 'reader-down']),
  isbn: z.string().regex(/^[\d-]{10,17}$/).optional(),
  coverImage: z.string().optional(),
  description: z.string().optional(),
  publishedDate: z.string().optional(),
  verified: z.boolean().default(false),
});

export const recommendationsSchema = z.array(bookRecommendationSchema).min(6).max(12); 

export const structureRequestSchema = z.object({
  rawInput: z.string().min(1).max(500),
  previousIdea: structuredIdeaSchema.optional(),
  feedback: z.string().optional(),
});

export const recommendRequestSchema = z.object({
  structuredIdea: structuredIdeaSchema,
});

export type StructuredIdeaSchema = z.infer<typeof structuredIdeaSchema>;
export type BookRecommendationSchema = z.infer<typeof bookRecommendationSchema>;