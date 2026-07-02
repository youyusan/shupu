import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from './rate-limiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter(5, 60000);
  });

  it('should allow first request', () => {
    const result = limiter.check('127.0.0.1');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('should allow requests within limit', () => {
    for (let i = 0; i < 5; i++) {
      const result = limiter.check('127.0.0.1');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }
  });

  it('should block requests exceeding limit', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('127.0.0.1');
    }
    
    const result = limiter.check('127.0.0.1');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should allow different IPs independently', () => {
    for (let i = 0; i < 5; i++) {
      limiter.check('127.0.0.1');
    }
    
    const result = limiter.check('127.0.0.2');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('should reset after window expires', () => {
    const fastLimiter = new RateLimiter(2, 100);
    
    fastLimiter.check('127.0.0.1');
    fastLimiter.check('127.0.0.1');
    
    const blocked = fastLimiter.check('127.0.0.1');
    expect(blocked.allowed).toBe(false);
    
    vi.useFakeTimers();
    vi.advanceTimersByTime(101);
    
    const allowed = fastLimiter.check('127.0.0.1');
    expect(allowed.allowed).toBe(true);
    expect(allowed.remaining).toBe(1);
    
    vi.useRealTimers();
  });

  it('should return correct resetTime', () => {
    const result = limiter.check('127.0.0.1');
    const now = Date.now();
    expect(result.resetTime).toBeGreaterThanOrEqual(now);
    expect(result.resetTime).toBeLessThanOrEqual(now + 60000);
  });
});