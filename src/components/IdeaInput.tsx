'use client';

import { useState } from 'react';
import { VoiceButton } from './VoiceButton';

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function IdeaInput({ value, onChange, onSubmit, isLoading }: IdeaInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  const charCount = value.length;
  const maxLength = 500;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
          placeholder="你想写一本什么样的书？用一句话描述你的想法..."
          maxLength={maxLength}
          rows={4}
          className={`
            w-full px-5 py-4 pr-20 text-lg
            bg-surface/80 backdrop-blur-md border rounded-2xl
            text-text placeholder:text-text-muted
            transition-all duration-300 resize-none
            focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isFocused ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'}
          `}
        />
        <div className="absolute right-4 bottom-3 flex items-center gap-2">
          <VoiceButton 
            onTextChange={(text) => onChange(text.slice(0, maxLength))} 
            disabled={isLoading}
          />
          <span className={`text-sm ${charCount > maxLength * 0.9 ? 'text-accent' : 'text-text-muted'}`}>
            {charCount}/{maxLength}
          </span>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className={`
          mt-4 w-full py-4 px-6 rounded-xl text-lg font-medium
          transition-all duration-300
          ${value.trim() && !isLoading
            ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
            : 'bg-surface text-text-muted cursor-not-allowed border border-border'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>正在分析...</span>
          </div>
        ) : (
          '开始找对标书'
        )}
      </button>
    </form>
  );
}