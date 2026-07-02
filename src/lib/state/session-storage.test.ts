import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getStoredData, setStoredData, clearStoredData } from './session-storage';

describe('sessionStorage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should return default data when nothing is stored', () => {
    const data = getStoredData();
    expect(data).toEqual({ rawInput: '' });
  });

  it('should store and retrieve data', () => {
    setStoredData({ rawInput: 'test input' });
    const data = getStoredData();
    expect(data.rawInput).toBe('test input');
  });

  it('should merge partial data', () => {
    setStoredData({ rawInput: 'input' });
    setStoredData({ step: 'structured' });
    const data = getStoredData();
    expect(data.rawInput).toBe('input');
    expect(data.step).toBe('structured');
  });

  it('should clear stored data', () => {
    setStoredData({ rawInput: 'test', step: 'map' });
    clearStoredData();
    const data = getStoredData();
    expect(data).toEqual({ rawInput: '' });
  });

  it('should handle structuredIdea', () => {
    const idea = {
      theme: 'Test Theme',
      genre: '科普',
      readerProfile: 'general',
      coreViewpoint: 'Test viewpoint',
    };
    setStoredData({ structuredIdea: idea });
    const data = getStoredData();
    expect(data.structuredIdea).toEqual(idea);
  });

  it('should handle recommendations', () => {
    const recommendations = [
      {
        title: 'Test Book',
        author: 'Author',
        coreSummary: 'Summary',
        reason: 'Reason',
        direction: 'anchor',
        verified: false,
      },
    ];
    setStoredData({ recommendations });
    const data = getStoredData();
    expect(data.recommendations).toEqual(recommendations);
  });
});