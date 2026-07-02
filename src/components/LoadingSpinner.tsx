'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 border-2 border-border rounded-full" />
      <div
        className="absolute inset-0 border-2 border-accent rounded-full border-t-transparent animate-spin"
        style={{ animationDuration: '0.8s' }}
      />
    </div>
  );
}