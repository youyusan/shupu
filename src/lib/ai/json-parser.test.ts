import { describe, it, expect } from 'vitest';
import { parseJsonFromLlm } from './json-parser';

describe('parseJsonFromLlm', () => {
  it('should parse plain JSON object', () => {
    const input = '{"key": "value", "number": 123}';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual({ key: 'value', number: 123 });
  });

  it('should parse JSON array', () => {
    const input = '[1, 2, 3]';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should strip markdown code blocks', () => {
    const input = '```json\n{"key": "value"}\n```';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual({ key: 'value' });
  });

  it('should strip markdown code blocks without json language', () => {
    const input = '```\n{"key": "value"}\n```';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual({ key: 'value' });
  });

  it('should extract JSON from text', () => {
    const input = 'Here is your data: {"key": "value"} Thank you.';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual({ key: 'value' });
  });

  it('should extract JSON array from text', () => {
    const input = 'Results: [1, 2, 3] - end';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle nested JSON object', () => {
    const input = '{"outer": {"inner": "value"}, "list": [1, 2]}';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual({ outer: { inner: 'value' }, list: [1, 2] });
  });

  it('should extract first JSON structure when multiple present', () => {
    const input = '[1, 2] {"key": "value"}';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual([1, 2]);
  });

  it('should prefer object when it appears first', () => {
    const input = '{"key": "value"} [1, 2]';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual({ key: 'value' });
  });

  it('should handle extra whitespace', () => {
    const input = '\n  {"key": "value"}  \n';
    const result = parseJsonFromLlm(input);
    expect(result).toEqual({ key: 'value' });
  });

  it('should throw on invalid JSON', () => {
    expect(() => parseJsonFromLlm('invalid json')).toThrow();
  });
});