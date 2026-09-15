import { describe, it, expect } from 'vitest';
import { computeFlyRankScore, DEFAULT_WEIGHTS } from './scoring';
import { FlightItinerary } from './types';

describe('computeFlyRankScore', () => {
  const sampleFlight: FlightItinerary = {
    flightId: 'FL-101',
    airline: 'Test Air',
    flightNumber: 'TA123',
    price: 400,
    currency: 'USD',
    totalDurationMinutes: 300,
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 8.5,
    co2EmissionsKg: 150,
  };

  it('computes composite score within [0, 100]', () => {
    const result = computeFlyRankScore(sampleFlight, DEFAULT_WEIGHTS);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.breakdown).toHaveProperty('priceScore');
    expect(result.breakdown).toHaveProperty('durationScore');
  });

  it('awards direct flights 100 layover score', () => {
    const result = computeFlyRankScore(sampleFlight);
    expect(result.breakdown.layoverScore).toBe(100);
  });
});
