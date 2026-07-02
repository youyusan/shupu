import type { BookRecommendation } from '@/types';
import { searchBook } from './google-books';
import { isHighConfidence } from './match-confidence';

export async function enrichBook(
  book: BookRecommendation
): Promise<BookRecommendation> {
  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  );

  try {
    const result = await Promise.race([
      searchBook(book.title, book.author, book.isbn),
      timeoutPromise,
    ]);

    if (!result) {
      return { ...book, verified: false };
    }

    if (!isHighConfidence(book, result)) {
      return { ...book, verified: false };
    }

    return {
      ...book,
      coverImage: result.imageLinks?.thumbnail || result.imageLinks?.smallThumbnail,
      description: result.description,
      publishedDate: result.publishedDate,
      verified: true,
    };
  } catch {
    return { ...book, verified: false };
  }
}

export async function enrichBooks(
  books: BookRecommendation[]
): Promise<void> {
  books.forEach((book) => {
    enrichBook(book);
  });
}