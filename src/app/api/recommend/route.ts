import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/ai/provider';
import { parseJsonFromLlm } from '@/lib/ai/json-parser';
import { recommendRequestSchema, recommendationsSchema } from '@/lib/ai/validator';
import { recommendPrompt } from '@/lib/prompts';
import { rateLimiter } from '@/lib/rate-limiter';
import { enrichBook } from '@/lib/books/enrich';
import type { ApiResponse, BookRecommendation, ErrorCode } from '@/types';

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('X-Forwarded-For');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('X-Real-IP');
  if (realIp) {
    return realIp;
  }
  return request.ip || 'unknown';
}

function createResponse<T>(
  data: T,
  rateLimit: { remaining: number; resetTime: number },
  status: number = 200
): NextResponse<ApiResponse<T>> {
  const response = NextResponse.json<ApiResponse<T>>(
    { success: true, data },
    { status }
  );
  response.headers.set('X-RateLimit-Limit', '10');
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
  return response;
}

function createErrorResponse(
  code: ErrorCode,
  message: string,
  rateLimit?: { remaining: number; resetTime: number },
  status: number = 400
): NextResponse<ApiResponse<never>> {
  const response = NextResponse.json<ApiResponse<never>>(
    { success: false, error: { code, message } },
    { status }
  );
  
  if (rateLimit) {
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
  }
  
  if (status === 429) {
    response.headers.set('Retry-After', '60');
  }
  
  return response;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = rateLimiter.check(ip);
    
    if (!rateLimitResult.allowed) {
      return createErrorResponse('RATE_LIMITED', '请求过于频繁，请稍后重试', rateLimitResult, 429);
    }
    
    const body = await request.json();
    const validation = recommendRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return createErrorResponse('INVALID_INPUT', '输入参数无效', rateLimitResult);
    }
    
    const { structuredIdea } = validation.data;
    
    const prompt = recommendPrompt(structuredIdea);
    const provider = getProvider();
    
    const aiResponse = await provider.chat(
      [{ role: 'system', content: prompt }],
      { responseFormat: 'json', temperature: 0.3 }
    );
    
    const parsed = parseJsonFromLlm(aiResponse);
    const result = recommendationsSchema.parse(parsed);
    
    const enrichedPromises = result.map((book) => enrichBook(book));
    const enrichedResults = await Promise.all(enrichedPromises);

    // 验证作为增强信息（封面/简介）而非硬门槛
    return createResponse<BookRecommendation[]>(enrichedResults, rateLimitResult);
  } catch (error) {
    console.error('Recommend API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('请配置')) {
        return createErrorResponse('AI_SERVICE_ERROR', '服务暂时不可用，请稍后重试');
      }
      if (error.message.includes('API 错误')) {
        return createErrorResponse('AI_SERVICE_ERROR', 'AI 服务调用失败，请稍后重试');
      }
      return createErrorResponse('INTERNAL_ERROR', '服务器内部错误，请稍后重试');
    }
    
    return createErrorResponse('INTERNAL_ERROR', '服务器内部错误，请稍后重试');
  }
}