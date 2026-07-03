import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/ai/provider';
import type { ChatMessage, ToolCall } from '@/lib/ai/provider';
import { parseJsonFromLlm } from '@/lib/ai/json-parser';
import { recommendRequestSchema, recommendationsSchema } from '@/lib/ai/validator';
import { recommendPrompt } from '@/lib/prompts';
import { rateLimiter } from '@/lib/rate-limiter';
import { searchBookTool, executeSearchBook } from '@/lib/books/search-book-tool';
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

    // 第1轮：发送 prompt + 搜索工具定义，让 DeepSeek 先搜索验证
    const messages: ChatMessage[] = [
      { role: 'system', content: prompt },
    ];

    const round1 = await provider.chat(messages, {
      tools: [searchBookTool],
      temperature: 0.3,
    });

    // 如果模型没有调用工具，说明它直接返回了结果
    if (!round1.toolCalls || round1.toolCalls.length === 0) {
      const parsed = parseJsonFromLlm(round1.content);
      const result = recommendationsSchema.parse(parsed);
      return createResponse<BookRecommendation[]>(result, rateLimitResult);
    }

    // 执行所有搜索工具调用
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: round1.content,
    };

    const toolResults: ChatMessage[] = [];

    for (const toolCall of round1.toolCalls) {
      if (toolCall.function.name !== 'search_book') continue;

      const args = JSON.parse(toolCall.function.arguments);
      const result = await executeSearchBook(args.title, args.author);

      toolResults.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    // 第2轮：把搜索结果反馈给 DeepSeek，生成最终推荐
    const round2 = await provider.chat(
      [...messages, assistantMessage, ...toolResults],
      { responseFormat: 'json', temperature: 0.3 }
    );

    const parsed = parseJsonFromLlm(round2.content);
    const result = recommendationsSchema.parse(parsed);

    return createResponse<BookRecommendation[]>(result, rateLimitResult);
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