import { getProvider } from '@/lib/ai/provider';
import { parseJsonFromLlm } from '@/lib/ai/json-parser';
import { structuredIdeaSchema, recommendationsSchema } from '@/lib/ai/validator';
import { structurePrompt, recommendPrompt } from '@/lib/prompts';
import { sanitizeInput } from '@/lib/utils/sanitize';
import type { StructuredIdea, BookRecommendation } from '@/types';

async function testStructure(rawInput: string): Promise<StructuredIdea | null> {
  console.log('\n=== 结构化分析 ===');
  console.log('输入:', rawInput);
  
  try {
    const sanitized = sanitizeInput(rawInput);
    const prompt = structurePrompt(sanitized);
    const provider = getProvider();
    
    const response = await provider.chat(
      [{ role: 'system', content: prompt }],
      { responseFormat: 'json', temperature: 0.3 }
    );
    
    console.log('AI响应:', response);
    
    const parsed = parseJsonFromLlm(response);
    const result = structuredIdeaSchema.parse(parsed);
    
    console.log('校验通过:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('结构化分析失败:', error);
    return null;
  }
}

async function testRecommend(structuredIdea: StructuredIdea): Promise<BookRecommendation[] | null> {
  console.log('\n=== 书籍推荐 ===');
  console.log('结构化想法:', JSON.stringify(structuredIdea));
  
  try {
    const prompt = recommendPrompt(structuredIdea);
    const provider = getProvider();
    
    const response = await provider.chat(
      [{ role: 'system', content: prompt }],
      { responseFormat: 'json', temperature: 0.3 }
    );
    
    console.log('AI响应:', response);
    
    const parsed = parseJsonFromLlm(response);
    const result = recommendationsSchema.parse(parsed);
    
    console.log('校验通过:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('书籍推荐失败:', error);
    return null;
  }
}

async function main() {
  const rawInput = process.argv[2];
  
  if (!rawInput) {
    console.error('请提供测试输入，例如: pnpm tsx scripts/test-ai.ts "我想写一本关于北漂的书"');
    process.exit(1);
  }
  
  console.log('书谱 AI 调用测试');
  
  const structuredIdea = await testStructure(rawInput);
  
  if (structuredIdea) {
    await testRecommend(structuredIdea);
  }
  
  console.log('\n=== 测试完成 ===');
}

main().catch(console.error);