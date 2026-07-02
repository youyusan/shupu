'use client';

import { useState } from 'react';
import type { BookRecommendation } from '@/types';

interface CopyButtonProps {
  books: BookRecommendation[];
}

export function CopyButton({ books }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `书谱为你找到的对标方向：\n\n${books.map(book => 
      `《${book.title}》\n作者：${book.author}\n核心概括：${book.coreSummary}\n推荐理由：${book.reason}\n`
    ).join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-300
        ${copied
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-surface text-text-muted hover:text-text border border-border hover:border-primary/50'
        }
      `}
    >
      {copied ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" clipRule="evenodd" />
          </svg>
          <span>已复制✓</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>复制分享</span>
        </>
      )}
    </button>
  );
}