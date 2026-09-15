import { FlightItinerary, RankingWeights } from '../types';
import { computeFlyRankScore, DEFAULT_WEIGHTS } from '../scoring';
import { fetchFlights, FlightSearchParams } from '../services/flightService';

export type SortCriterion = 'flyrank' | 'price' | 'duration' | 'eco';

export interface FlightFilterCriteria {
  maxStops?: number;
  maxPrice?: number;
  selectedAirlines?: string[];
  maxLayoverMinutes?: number;
  prioritizeDirect?: boolean;
}

export class FlightModel {
  /**
   * Fetches flights matching search criteria, calculates their FlyRank scores,
   * and sorts them by the specified criterion.
   */
  static async getRankedFlights(
    searchParams?: FlightSearchParams,
    weights: RankingWeights = DEFAULT_WEIGHTS,
    sortBy: SortCriterion = 'flyrank'
  ): Promise<FlightItinerary[]> {
    const rawFlights = await fetchFlights(searchParams);

    // Compute FlyRank scores and breakdowns for all flights
    const scoredFlights: FlightItinerary[] = rawFlights.map((flight) => {
      const { score, breakdown } = computeFlyRankScore(flight, weights);
      return {
        ...flight,
        flyrankScore: score,
        scoreBreakdown: breakdown,
      };
    });

    return this.sortFlights(scoredFlights, sortBy);
  }

  /**
   * Sorts flight itineraries based on user criteria.
   */
  static sortFlights(flights: FlightItinerary[], criterion: SortCriterion): FlightItinerary[] {
    const sorted = [...flights];
    switch (criterion) {
      case 'flyrank':
        return sorted.sort((a, b) => (b.flyrankScore ?? 0) - (a.flyrankScore ?? 0));
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'duration':
        return sorted.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
      case 'eco':
        return sorted.sort((a, b) => a.co2EmissionsKg - b.co2EmissionsKg);
      default:
        return sorted;
    }
  }

  /**
   * Filters flight itineraries by stops, price limit, airline, and layovers.
   */
  static applyFilters(flights: FlightItinerary[], filters: FlightFilterCriteria): FlightItinerary[] {
    return flights.filter((flight) => {
      if (filters.maxStops !== undefined && flight.stops > filters.maxStops) {
        return false;
      }
      if (filters.prioritizeDirect && flight.stops > 0) {
        return false;
      }
      if (filters.maxPrice !== undefined && flight.price > filters.maxPrice) {
        return false;
      }
      if (
        filters.maxLayoverMinutes !== undefined &&
        flight.stops > 0 &&
        flight.layoverDurationMinutes > filters.maxLayoverMinutes
      ) {
        return false;
      }
      if (
        filters.selectedAirlines &&
        filters.selectedAirlines.length > 0 &&
        !filters.selectedAirlines.includes(flight.airline)
      ) {
        return false;
      }
      return true;
    });
  }

  /**
   * Re-scores an existing list of flights when weights change (in-memory without network request).
   */
  static recalculateScores(
    flights: FlightItinerary[],
    weights: RankingWeights,
    sortBy: SortCriterion = 'flyrank'
  ): FlightItinerary[] {
    const updated = flights.map((flight) => {
      const { score, breakdown } = computeFlyRankScore(flight, weights);
      return {
        ...flight,
        flyrankScore: score,
        scoreBreakdown: breakdown,
      };
    });
    return this.sortFlights(updated, sortBy);
  }
}
