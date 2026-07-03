import type { ToolDefinition } from '@/lib/ai/provider';
import { searchBook } from './google-books';
import type { GoogleBookVolumeInfo } from './google-books';

/**
 * DeepSeek function calling 工具定义：搜索一本书是否存在
 */
export const searchBookTool: ToolDefinition = {
  type: 'function',
  function: {
    name: 'search_book',
    description:
      '搜索一本书是否真实存在。调用此工具来验证你推荐的书籍是否是真实出版的图书，获取准确的标题、作者和出版信息。',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: '书名',
        },
        author: {
          type: 'string',
          description: '作者（可选）',
        },
      },
      required: ['title'],
    },
  },
};

export interface SearchBookResult {
  title: string;
  author?: string;
  exists: boolean;
  foundTitle?: string;
  foundAuthor?: string;
  description?: string;
}

const normalize = (s: string) =>
  s.replace(/[\s\u3000\-—·.,!?;:，。！？；：、]/g, '').toLowerCase();

function fuzzyMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na.includes(nb) || nb.includes(na)) return true;
  if (na.length > 0 && nb.length > 0) {
    const minLength = Math.min(na.length, nb.length);
    const matchLength = Array.from(na).filter((char, i) => char === nb[i]).length;
    if (matchLength >= minLength * 0.4) return true;
  }
  return false;
}

/**
 * 执行搜索工具，返回格式化的搜索摘要
 */
export async function executeSearchBook(
  title: string,
  author?: string
): Promise<string> {
  try {
    const volumeInfo = await searchBook(title, author);
    if (!volumeInfo) {
      return JSON.stringify({
        title,
        author,
        exists: false,
        message: '未找到匹配的书籍信息',
      });
    }

    const titleMatch = fuzzyMatch(volumeInfo.title, title);
    if (!titleMatch) {
      return JSON.stringify({
        title,
        author,
        exists: false,
        message: `搜索到了 "${volumeInfo.title}" 但书名差异较大，可能不是同一本书`,
        foundTitle: volumeInfo.title,
      });
    }

    const result: SearchBookResult = {
      title,
      author,
      exists: true,
      foundTitle: volumeInfo.title,
      foundAuthor: volumeInfo.authors?.[0],
      description: volumeInfo.description,
    };

    return JSON.stringify(result);
  } catch {
    return JSON.stringify({
      title,
      author,
      exists: false,
      message: '搜索服务暂时不可用',
    });
  }
}