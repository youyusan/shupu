import { fetchWithTimeout } from './client';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  responseFormat?: 'json' | 'text';
}

export interface ModelProvider {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<string>;
}

export class DeepSeekProvider implements ModelProvider {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('请配置 DEEPSEEK_API_KEY');
    }
  }
  
  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<string> {
    const temperature = options?.temperature ?? 0.3;
    const responseFormat = options?.responseFormat ?? 'text';
    
    const requestBody = {
      model: 'deepseek-chat',
      messages,
      temperature,
      ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
    };
    
    const response = await fetchWithTimeout('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      timeout: 30000,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API 错误: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

export class OpenAIProvider implements ModelProvider {
  async chat(): Promise<string> {
    throw new Error('OpenAI 模型尚未实现，请配置 DEEPSEEK_API_KEY');
  }
}

export function getProvider(): ModelProvider {
  if (process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI 模型尚未实现，请使用 DeepSeek');
  }
  return new DeepSeekProvider();
}