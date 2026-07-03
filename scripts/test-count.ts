import { recommendPromptV1 } from '@/lib/prompts/recommend/v1';
import { DeepSeekProvider } from '@/lib/ai/provider';

const structuredIdea = {
  theme: '北漂生活',
  genre: '随笔',
  readerProfile: '对北漂好奇或经历者',
  coreViewpoint: '北漂是追梦与生存的挣扎'
};

async function main() {
  const provider = new DeepSeekProvider();
  const prompt = recommendPromptV1(structuredIdea);

  console.log('Prompt 长度:', prompt.length);
  console.log('\n=== 调用 DeepSeek ===\n');

  const response = await provider.chat(
    [{ role: 'system', content: prompt }],
    { responseFormat: 'json', temperature: 0.3 }
  );

  console.log('响应内容:');
  console.log(response.content);

  try {
    const books = JSON.parse(response.content);
    console.log('\n=== 解析结果 ===');
    console.log('书本数量:', books.length);
    books.forEach((b: any, i: number) => {
      console.log(`${i + 1}. 《${b.title}》 ${b.author} [${b.direction}]`);
    });
  } catch (e) {
    console.log('JSON 解析失败');
  }
}

main().catch(console.error);
