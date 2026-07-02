'use client';

import type { BookRecommendation } from '@/types';

interface BookCardProps {
  book: BookRecommendation;
  isAnchor?: boolean;
}

export function BookCard({ book, isAnchor }: BookCardProps) {
  return (
    <div className={`
      relative p-5 rounded-xl border bg-surface/80 backdrop-blur-md
      transition-all duration-300 hover:shadow-lg
      ${isAnchor ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'}
    `}>
      {isAnchor && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
          最接近你的想法
        </div>
      )}
      
      <h3 className="text-lg font-bold text-text mb-1">{book.title}</h3>
      <p className="text-text-muted text-sm mb-3">{book.author}</p>
      
      <p className="text-text text-sm mb-2 leading-relaxed">
        <span className="text-text-muted">核心概括：</span>
        {book.coreSummary}
      </p>
      
      <p className="text-text-muted text-xs leading-relaxed">
        <span className="text-text-muted">推荐理由：</span>
        {book.reason}
      </p>
    </div>
  );
}