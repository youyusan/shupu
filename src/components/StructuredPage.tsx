'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-context';
import { StepIndicator } from './StepIndicator';

export function StructuredPage() {
  const { state, dispatch } = useAppState();
  const router = useRouter(); 

  useEffect(() => {
    if (!state.structuredIdea) {
      router.push('/');
      return;
    }
  }, [state.structuredIdea, router]);

  useEffect(() => {
    const animElements = document.querySelectorAll('.anim');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      animElements.forEach(el => el.classList.add('active'));
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animElements.forEach(el => el.classList.add('active'));
      });
    });
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const handleContinue = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structuredIdea: state.editedIdea }),
      });

      const data = await response.json();

      if (!data.success) {
        dispatch({ type: 'SET_ERROR', payload: data.error?.message || '请求失败' });
        return;
      }

      dispatch({ type: 'SET_RECOMMENDATIONS', payload: data.data });
      router.push('/map');
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '网络错误，请稍后重试' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (!state.editedIdea) {
    dispatch({ type: 'GO_TO_STEP', payload: 'home' });
    return null;
  }

  const tags = [
    { 
      label: '主题', 
      key: 'theme' as const, 
      value: state.editedIdea.theme,
      dotClass: 'bg-accent'
    },
    { 
      label: '体裁倾向', 
      key: 'genre' as const, 
      value: state.editedIdea.genre,
      dotClass: 'bg-warm-2'
    },
    { 
      label: '读者画像', 
      key: 'readerProfile' as const, 
      value: state.editedIdea.readerProfile,
      dotClass: 'bg-accent-hover'
    },
    { 
      label: '核心观点方向', 
      key: 'coreViewpoint' as const, 
      value: state.editedIdea.coreViewpoint,
      dotClass: 'bg-warm-1'
    },
  ];

  const questionSentence = `看起来你想写的是一本关于${state.editedIdea.theme}的${state.editedIdea.genre}，面向${state.editedIdea.readerProfile}，讲述${state.editedIdea.coreViewpoint}的故事。对吗？`;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-3xl">
        <header className="flex items-center justify-between mb-8 anim" data-delay="1">
          <button 
            onClick={handleBack}
            className="font-display text-xl font-bold text-text tracking-[0.02em]"
          >
            书<span className="text-accent">谱</span>
          </button>
          <button 
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors px-2 py-1.5 rounded-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            重新开始
          </button>
        </header>
        <div className="flex justify-center mb-6 anim" data-delay="1.5">
          <StepIndicator currentStep="structured" />
        </div>

        <div className="text-center">
          <h1 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-text leading-[1.3] tracking-[-0.02em] mb-6 anim" data-delay="2">
            我对你的想法的理解
          </h1>

          <p className="text-[clamp(1rem,2.5vw,1.1875rem)] text-text-secondary leading-[1.75] max-w-2xl mx-auto mb-10 anim" data-delay="3">
            {questionSentence}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {tags.map(({ label, key, value, dotClass }, index) => (
              <button
                key={key}
                onClick={() => {}}
                className="flex items-center gap-3 p-4 bg-surface border border-border-subtle rounded-xl text-left hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_0_0_1px_var(--color-border)] hover:border-border hover:bg-surface-hover active:translate-y-0 active:scale-[0.99] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg anim"
                data-delay={index + 4}
                aria-label={`${label}：${value}，点击调整`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs text-text-muted tracking-[0.04em] mb-1">{label}</span>
                  <span className="block text-sm font-medium text-text leading-[1.4]">{value}</span>
                </div>
                <svg 
                  className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  aria-hidden="true"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
            ))}
          </div>

          <p className="text-sm text-text-muted mb-10 anim" data-delay="5">
            点击任意标签可以调整
          </p>

          {state.error && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" clipRule="evenodd" />
              </svg>
              <span>{state.error}</span>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleContinue}
              disabled={state.isLoading}
              className="w-full max-w-xs py-3.5 px-8 bg-accent text-bg font-semibold rounded-full hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,165,116,0.3)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-2 anim"
              data-delay="6"
            >
              {state.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在找对标书...
                </>
              ) : (
                '看起来没错，看结果吧'
              )}
            </button>

            <button
              onClick={() => {}}
              className="w-full max-w-xs py-3.5 px-8 bg-transparent text-accent border border-border rounded-full font-medium hover:bg-accent-dim hover:border-accent active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 anim"
              data-delay="7"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
              不太对，帮我调整
            </button>

            <button
              onClick={handleContinue}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors py-2 anim"
              data-delay="7"
            >
              直接看结果
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
            <p className="text-xs text-text-muted opacity-70 anim" data-delay="7">
              跳过可能会让推荐不够精准
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .anim {
          opacity: 0;
          transform: translateY(20px);
          will-change: opacity, transform;
        }
        .anim.active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo);
        }
        .anim[data-delay="1"].active { transition-delay: 0s; }
        .anim[data-delay="2"].active { transition-delay: 0.1s; }
        .anim[data-delay="3"].active { transition-delay: 0.2s; }
        .anim[data-delay="4"].active { transition-delay: 0.3s; }
        .anim[data-delay="5"].active { transition-delay: 0.4s; }
        .anim[data-delay="6"].active { transition-delay: 0.5s; }
        .anim[data-delay="7"].active { transition-delay: 0.6s; }
        .anim[data-delay="8"].active { transition-delay: 0.7s; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .anim { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
