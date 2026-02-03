import { describe, it, expect } from 'vitest';
import {
  isTime12hFormat,
  isTime24hFormat
} from '../useDateFunctions';

describe('format detection', () => {
  it('detects 12h format', () => {
    expect(isTime12hFormat('01:00pm')).toBe(true);
    expect(isTime12hFormat('12:30am')).toBe(true);
    expect(isTime12hFormat('11:59PM')).toBe(true);
    expect(isTime12hFormat('13:00')).toBe(false);
    expect(isTime12hFormat('invalid')).toBe(false);
  });

  it('detects 24h format', () => {
    expect(isTime24hFormat('13:00')).toBe(true);
    expect(isTime24hFormat('00:00')).toBe(true);
    expect(isTime24hFormat('23:59')).toBe(true);
    expect(isTime24hFormat('01:00pm')).toBe(false);
    expect(isTime24hFormat('invalid')).toBe(false);
  });
});
