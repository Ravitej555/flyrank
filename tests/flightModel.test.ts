import { describe, it, expect } from 'vitest';
import { FlightModel } from '../lib/models/FlightModel';
import { RankingWeights } from '../lib/types';

describe('FlightModel', () => {
  it('should fetch and score flights with FlyRank composite score', async () => {
    const flights = await FlightModel.getRankedFlights(
      { origin: 'JFK', destination: 'LHR' },
      { price: 40, duration: 25, layover: 15, carrier: 10, eco: 10 },
      'flyrank'
    );

    expect(flights.length).toBeGreaterThan(0);
    const topFlight = flights[0];
    expect(topFlight.flyrankScore).toBeDefined();
    expect(topFlight.flyrankScore).toBeGreaterThanOrEqual(0);
    expect(topFlight.flyrankScore).toBeLessThanOrEqual(100);
    expect(topFlight.scoreBreakdown).toBeDefined();

    // Verify descending order of flyrank score
    for (let i = 0; i < flights.length - 1; i++) {
      expect(flights[i].flyrankScore!).toBeGreaterThanOrEqual(flights[i + 1].flyrankScore!);
    }
  });

  it('should sort flights by lowest price when price criterion is selected', async () => {
    const flights = await FlightModel.getRankedFlights(
      { origin: 'JFK', destination: 'LHR' },
      { price: 40, duration: 25, layover: 15, carrier: 10, eco: 10 },
      'price'
    );

    for (let i = 0; i < flights.length - 1; i++) {
      expect(flights[i].price).toBeLessThanOrEqual(flights[i + 1].price);
    }
  });

  it('should filter flights strictly by maxStops and prioritizeDirect', async () => {
    const flights = await FlightModel.getRankedFlights();
    const directOnly = FlightModel.applyFilters(flights, { maxStops: 0, prioritizeDirect: true });

    expect(directOnly.length).toBeGreaterThan(0);
    directOnly.forEach((f) => {
      expect(f.stops).toBe(0);
    });
  });

  it('should recalculate scores dynamically when weights shift toward eco-efficiency', async () => {
    const flights = await FlightModel.getRankedFlights();

    // Give 80% weight to eco
    const ecoWeights: RankingWeights = {
      price: 5,
      duration: 5,
      layover: 5,
      carrier: 5,
      eco: 80,
    };

    const reRanked = FlightModel.recalculateScores(flights, ecoWeights, 'flyrank');
    const winner = reRanked[0];

    // The winner under eco-heavy weights should have low carbon emissions
    expect(winner.co2EmissionsKg).toBeLessThanOrEqual(215);
  });
});
