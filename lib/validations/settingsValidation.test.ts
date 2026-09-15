import { describe, it, expect } from 'vitest';
import {
  RankingWeightsSchema,
  UserPreferencesSchema,
  DEFAULT_USER_PREFERENCES,
} from './settings';

describe('RankingWeightsSchema', () => {
  it('accepts default weights summing to exactly 100', () => {
    const result = RankingWeightsSchema.safeParse(DEFAULT_USER_PREFERENCES.weights);
    expect(result.success).toBe(true);
  });

  it('accepts valid floating-point weights within epsilon tolerance (e.g. 33.3 + 33.3 + 33.4 = 100)', () => {
    const weights = {
      price: 33.3,
      duration: 33.3,
      layover: 33.4,
      carrier: 0,
      eco: 0,
    };
    const result = RankingWeightsSchema.safeParse(weights);
    expect(result.success).toBe(true);
  });

  it('rejects weights summing to less than 100', () => {
    const weights = {
      price: 30,
      duration: 20,
      layover: 10,
      carrier: 10,
      eco: 10, // Sum = 80
    };
    const result = RankingWeightsSchema.safeParse(weights);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('must sum to exactly 100%');
    }
  });

  it('rejects weights summing to greater than 100', () => {
    const weights = {
      price: 50,
      duration: 30,
      layover: 20,
      carrier: 10,
      eco: 10, // Sum = 120
    };
    const result = RankingWeightsSchema.safeParse(weights);
    expect(result.success).toBe(false);
  });

  it('rejects negative weights', () => {
    const weights = {
      price: -10,
      duration: 40,
      layover: 30,
      carrier: 20,
      eco: 20, // Sum = 100 but negative price
    };
    const result = RankingWeightsSchema.safeParse(weights);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 0%');
    }
  });

  it('rejects individual weights exceeding 100%', () => {
    const weights = {
      price: 105,
      duration: 0,
      layover: 0,
      carrier: 0,
      eco: -5,
    };
    const result = RankingWeightsSchema.safeParse(weights);
    expect(result.success).toBe(false);
  });
});

describe('UserPreferencesSchema', () => {
  it('accepts fully valid preferences configuration', () => {
    const result = UserPreferencesSchema.safeParse(DEFAULT_USER_PREFERENCES);
    expect(result.success).toBe(true);
  });

  it('rejects unsupported currency code', () => {
    const invalid = {
      ...DEFAULT_USER_PREFERENCES,
      currency: 'JPY',
    };
    const result = UserPreferencesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects maxStops greater than 3', () => {
    const invalid = {
      ...DEFAULT_USER_PREFERENCES,
      maxStops: 5,
    };
    const result = UserPreferencesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects non-integer maxStops', () => {
    const invalid = {
      ...DEFAULT_USER_PREFERENCES,
      maxStops: 1.5,
    };
    const result = UserPreferencesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
