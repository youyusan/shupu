'use client';

import { useState, useRef, useEffect } from 'react';

interface TagCardProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  editingTag: string | null;
  onEditingChange: (tag: string | null) => void;
}

export function TagCard({ label, value, onChange, editingTag, onEditingChange }: TagCardProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTag === label && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTag, label]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClick = () => {
    if (editingTag !== label) {
      onEditingChange(label);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() !== value) {
      onChange(inputValue.trim());
    }
    onEditingChange(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputValue.trim() !== value) {
        onChange(inputValue.trim());
      }
      onEditingChange(null);
    } else if (e.key === 'Escape') {
      setInputValue(value);
      onEditingChange(null);
    }
  };

  const isEditing = editingTag === label;

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-4 rounded-xl border cursor-pointer
        transition-all duration-300
        ${isEditing
          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
          : 'border-border bg-surface/50 hover:border-primary/50 hover:bg-surface'
        }
      `}
    >
      <span className="text-xs text-text-muted uppercase tracking-wider mb-2 block">
        {label}
      </span>
      {isEditing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-text text-lg font-medium outline-none"
        />
      ) : (
        <span className="text-text text-lg font-medium">{value}</span>
      )}
      <div className="absolute right-3 top-3 opacity-0 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
    </div>
  );
}