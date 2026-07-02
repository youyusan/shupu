'use client';

import { useEffect } from 'react';

interface ErrorState {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorState) {
  useEffect(() => {
    console.error('ErrorBoundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">😵</div>
      <h1 className="text-2xl font-display font-bold text-text mb-4">页面出错了</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        抱歉，页面加载时出现了问题。请刷新页面重试。
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-accent text-bg font-semibold rounded-full hover:bg-accent-hover hover:-translate-y-0.5 transition-all duration-200"
      >
        刷新重试
      </button>
    </div>
  );
}