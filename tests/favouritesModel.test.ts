import { describe, it, expect, beforeEach } from 'vitest';
import { FavouritesModel } from '../lib/models/FavouritesModel';
import { FlightItinerary } from '../lib/types';

const mockFlightA: FlightItinerary = {
  flightId: 'TEST-001',
  airline: 'Test Airways',
  flightNumber: 'TA 101',
  price: 500,
  currency: 'USD',
  totalDurationMinutes: 400,
  stops: 0,
  layoverDurationMinutes: 0,
  carrierRating: 9.0,
  co2EmissionsKg: 200,
  flyrankScore: 92.5,
};

const mockFlightB: FlightItinerary = {
  flightId: 'TEST-002',
  airline: 'Eco Jet',
  flightNumber: 'EJ 202',
  price: 300,
  currency: 'USD',
  totalDurationMinutes: 600,
  stops: 1,
  layoverDurationMinutes: 100,
  carrierRating: 8.0,
  co2EmissionsKg: 180,
  flyrankScore: 84.0,
};

describe('FavouritesModel', () => {
  it('should toggle favourite status and calculate accurate aggregate stats', () => {
    // Save flight A
    const saveA = FavouritesModel.toggleFavourite(mockFlightA);
    expect(saveA.isSaved).toBe(true);
    expect(FavouritesModel.isSaved('TEST-001')).toBe(true);

    // Save flight B
    const saveB = FavouritesModel.toggleFavourite(mockFlightB);
    expect(saveB.isSaved).toBe(true);
    expect(FavouritesModel.isSaved('TEST-002')).toBe(true);

    // Check stats
    const stats = FavouritesModel.getStats([mockFlightA, mockFlightB]);
    expect(stats.totalCount).toBe(2);
    expect(stats.averagePrice).toBe(400); // (500 + 300) / 2
    expect(stats.averageDurationMinutes).toBe(500); // (400 + 600) / 2
    expect(stats.averageScore).toBe(88.3); // (92.5 + 84.0) / 2 = 88.25 -> 88.3

    // Remove flight A
    const removeA = FavouritesModel.removeFavourite('TEST-001');
    expect(FavouritesModel.isSaved('TEST-001')).toBe(false);
  });

  it('should return zeroed stats for empty list', () => {
    const stats = FavouritesModel.getStats([]);
    expect(stats.totalCount).toBe(0);
    expect(stats.averageScore).toBe(0);
    expect(stats.averagePrice).toBe(0);
  });
});
