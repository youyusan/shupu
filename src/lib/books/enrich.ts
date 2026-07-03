import type { BookRecommendation } from '@/types';
import { verifyBookExists } from './verify';

export async function enrichBook(
  book: BookRecommendation
): Promise<BookRecommendation> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 8000)
  );

  try {
    const verifyResult = await Promise.race([
      verifyBookExists(book.title, book.author, book.isbn),
      timeoutPromise,
    ]);

    const enriched: BookRecommendation = { ...book };

    if (verifyResult.volumeInfo) {
      enriched.coverImage =
        verifyResult.volumeInfo.imageLinks?.thumbnail ||
        verifyResult.volumeInfo.imageLinks?.smallThumbnail;
      enriched.description = verifyResult.volumeInfo.description;
      enriched.publishedDate = verifyResult.volumeInfo.publishedDate;
    }

    return enriched;
  } catch {
    return { ...book };
  }
}

export async function enrichBooks(
  books: BookRecommendation[]
): Promise<void> {
  books.forEach((book) => {
    enrichBook(book);
  });
}
