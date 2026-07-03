import { fetchWithTimeout } from './client';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolResultMessage {
  role: 'tool';
  tool_call_id: string;
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  responseFormat?: 'json' | 'text';
  tools?: ToolDefinition[];
}

export interface ChatResponse {
  content: string;
  toolCalls?: ToolCall[];
}

export interface ModelProvider {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
}

export class DeepSeekProvider implements ModelProvider {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('请配置 DEEPSEEK_API_KEY');
    }
  }
  
  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const temperature = options?.temperature ?? 0.3;
    const responseFormat = options?.responseFormat ?? 'text';
    
    const requestBody: Record<string, unknown> = {
      model: 'deepseek-chat',
      messages,
      temperature,
    };

    if (responseFormat === 'json') {
      requestBody.response_format = { type: 'json_object' };
    }

    if (options?.tools && options.tools.length > 0) {
      requestBody.tools = options.tools;
      requestBody.tool_choice = 'auto';
    }
    
    const maxRetries = 3;
    const retryDelay = 1000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const response = await fetchWithTimeout('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        timeout: 60000,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 503 && attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          continue;
        }
        
        throw new Error(`DeepSeek API 错误: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      const message = data.choices?.[0]?.message;
      
      return {
        content: message?.content || '',
        toolCalls: message?.tool_calls?.map((tc: Record<string, unknown>) => ({
          id: tc.id as string,
          type: 'function' as const,
          function: {
            name: (tc.function as Record<string, string>).name,
            arguments: (tc.function as Record<string, string>).arguments,
          },
        })),
      };
    }
    
    throw new Error('DeepSeek API 服务繁忙，请稍后重试');
  }
}

export class OpenAIProvider implements ModelProvider {
  async chat(): Promise<ChatResponse> {
    throw new Error('OpenAI 模型尚未实现，请配置 DEEPSEEK_API_KEY');
  }
}

export function getProvider(): ModelProvider {
  if (process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI 模型尚未实现，请使用 DeepSeek');
  }
  return new DeepSeekProvider();
}