'use client';

import type { BookRecommendation } from '@/types';

interface BookCardProps {
  book: BookRecommendation;
  isAnchor?: boolean;
}

const WarningIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export function BookCard({ book, isAnchor }: BookCardProps) {
  const isUnverified = book.verified === false;

  return (
    <div className={`
      relative p-5 rounded-xl border bg-surface/80 backdrop-blur-md
      transition-all duration-300 hover:shadow-lg
      ${isAnchor ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'}
      ${isUnverified ? 'border-dashed' : ''}
    `}
    style={isUnverified ? { borderColor: 'rgba(245, 158, 11, 0.4)' } : undefined}
    >
      {isUnverified && (
        <span className="absolute top-2 right-2 z-5 flex items-center justify-center">
          <span
            className="flex items-center justify-center w-5 h-5 cursor-help rounded"
            tabIndex={0}
            role="img"
            aria-label="未验证"
            style={{ color: 'rgba(245, 158, 11, 0.7)' }}
          >
            <WarningIcon className="w-4 h-4" />
          </span>
          <span
            className="absolute top-7 right-0 w-48 p-2.5 rounded-lg text-xs leading-relaxed text-left pointer-events-none opacity-0 -translate-y-1 transition-all duration-200"
            style={{
              background: 'rgba(24, 24, 28, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--color-text-secondary)',
            }}
          >
            未验证 — 此书 AI 可能存在幻觉，请人工验证后再参考
          </span>
        </span>
      )}

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

      {isUnverified && (
        <style>{`
          .absolute.top-2.right-2:hover > span:last-child,
          .absolute.top-2.right-2 > span:focus-visible + span {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        `}</style>
      )}
    </div>
  );
}
