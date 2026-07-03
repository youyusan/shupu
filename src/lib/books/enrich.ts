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

    if (!verifyResult.exists) {
      return { ...book, verified: false };
    }

    // 如果 Google Books 返回了详细信息，用于丰富书籍数据
    const enriched: BookRecommendation = {
      ...book,
      verified: true,
    };

    if (verifyResult.volumeInfo) {
      enriched.coverImage =
        verifyResult.volumeInfo.imageLinks?.thumbnail ||
        verifyResult.volumeInfo.imageLinks?.smallThumbnail;
      enriched.description = verifyResult.volumeInfo.description;
      enriched.publishedDate = verifyResult.volumeInfo.publishedDate;
    }

    return enriched;
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