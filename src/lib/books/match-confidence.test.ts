import { describe, it, expect } from 'vitest';
import { isHighConfidence } from './match-confidence';

describe('isHighConfidence', () => {
  it('should return true when ISBN matches', () => {
    const result = isHighConfidence(
      { title: 'Test Book', author: 'Author', isbn: '978-1234567890' },
      {
        title: 'Test Book',
        authors: ['Author'],
        industryIdentifiers: [{ type: 'ISBN_13', identifier: '9781234567890' }],
      }
    );
    expect(result).toBe(true);
  });

  it('should return true when ISBN matches with different format', () => {
    const result = isHighConfidence(
      { title: 'Test', author: 'A', isbn: '1234567890' },
      {
        title: 'Test Book',
        authors: ['Author'],
        industryIdentifiers: [{ type: 'ISBN_10', identifier: '1234567890' }],
      }
    );
    expect(result).toBe(true);
  });

  it('should return true when title and author match exactly', () => {
    const result = isHighConfidence(
      { title: '百年孤独', author: '加西亚·马尔克斯' },
      { title: '百年孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(true);
  });

  it('should return true when title is substring', () => {
    const result = isHighConfidence(
      { title: '孤独', author: '马尔克斯' },
      { title: '百年孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(true);
  });

  it('should return true when Google Books title is substring', () => {
    const result = isHighConfidence(
      { title: '百年孤独', author: '加西亚·马尔克斯' },
      { title: '百年孤独（精装版）', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(true);
  });

  it('should return true when author is substring', () => {
    const result = isHighConfidence(
      { title: '百年孤独', author: '马尔克斯' },
      { title: '百年孤独', authors: ['加夫列尔·加西亚·马尔克斯'] }
    );
    expect(result).toBe(true);
  });

  it('should normalize whitespace and punctuation', () => {
    const result = isHighConfidence(
      { title: '百年 孤独', author: '加西亚·马尔克斯' },
      { title: '百年·孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(true);
  });

  it('should be case insensitive', () => {
    const result = isHighConfidence(
      { title: 'TEST BOOK', author: 'AUTHOR' },
      { title: 'test book', authors: ['author'] }
    );
    expect(result).toBe(true);
  });

  it('should return false when title does not match', () => {
    const result = isHighConfidence(
      { title: '不同的书', author: '加西亚·马尔克斯' },
      { title: '百年孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(false);
  });

  it('should return false when author does not match', () => {
    const result = isHighConfidence(
      { title: '百年孤独', author: '不同的作者' },
      { title: '百年孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(false);
  });

  it('should return false when neither title nor author matches', () => {
    const result = isHighConfidence(
      { title: '完全不同的书', author: '完全不同的作者' },
      { title: '百年孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(false);
  });

  it('should handle multiple authors', () => {
    const result = isHighConfidence(
      { title: 'Book', author: 'Author B' },
      { title: 'Book', authors: ['Author A', 'Author B', 'Author C'] }
    );
    expect(result).toBe(true);
  });

  it('should handle missing ISBN', () => {
    const result = isHighConfidence(
      { title: '百年孤独', author: '加西亚·马尔克斯' },
      { title: '百年孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(true);
  });

  it('should handle missing industryIdentifiers', () => {
    const result = isHighConfidence(
      { title: '百年孤独', author: '加西亚·马尔克斯', isbn: '1234567890' },
      { title: '百年孤独', authors: ['加西亚·马尔克斯'] }
    );
    expect(result).toBe(true);
  });
});