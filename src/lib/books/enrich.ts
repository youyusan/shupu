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

    const enriched: BookRecommendation = {
      ...book,
      verified: verifyResult.exists,
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
    // 验证超时或出错：不丢弃，标记为未验证
    return { ...book, verified: false };
  }
}

/**
 * 并行验证并补全所有书籍。
 * 返回新数组，每本书带 verified 字段。
 */
export async function enrichBooks(
  books: BookRecommendation[]
): Promise<BookRecommendation[]> {
  return Promise.all(books.map((book) => enrichBook(book)));
}
