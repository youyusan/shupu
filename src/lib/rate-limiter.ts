export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }>;
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests = 10, windowMs = 60000) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  check(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const existing = this.requests.get(ip);
    
    if (!existing || now >= existing.resetTime) {
      this.requests.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }
    
    if (existing.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime,
      };
    }
    
    existing.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - existing.count,
      resetTime: existing.resetTime,
    };
  }
}

export const rateLimiter = new RateLimiter();