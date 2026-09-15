import { describe, it, expect } from 'vitest';
import { normalizeApiUrl } from './api';

describe('normalizeApiUrl', () => {
  it('appends /api to a bare backend origin (the exact production bug reported)', () => {
    expect(normalizeApiUrl('https://lj-careerconnect.onrender.com')).toBe(
      'https://lj-careerconnect.onrender.com/api'
    );
  });

  it('strips a trailing slash before appending /api', () => {
    expect(normalizeApiUrl('https://lj-careerconnect.onrender.com/')).toBe(
      'https://lj-careerconnect.onrender.com/api'
    );
  });

  it('leaves a URL that already ends in /api unchanged (no double /api)', () => {
    expect(normalizeApiUrl('https://lj-careerconnect.onrender.com/api')).toBe(
      'https://lj-careerconnect.onrender.com/api'
    );
  });

  it('strips a trailing slash on an already-prefixed URL without doubling /api', () => {
    expect(normalizeApiUrl('https://lj-careerconnect.onrender.com/api/')).toBe(
      'https://lj-careerconnect.onrender.com/api'
    );
  });

  it('leaves the local dev default unchanged', () => {
    expect(normalizeApiUrl('http://localhost:5000/api')).toBe('http://localhost:5000/api');
  });
});
