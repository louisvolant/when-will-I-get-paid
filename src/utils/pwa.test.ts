import { describe, expect, it } from 'vitest';
import { isIosDevice, isStandalone } from './pwa';

describe('PWA detection utilities', () => {
  it('detects standalone mode fallback when not standalone', () => {
    expect(isStandalone()).toBe(false);
  });

  it('runs isIosDevice in non-browser environment safely', () => {
    expect(typeof isIosDevice()).toBe('boolean');
  });
});
