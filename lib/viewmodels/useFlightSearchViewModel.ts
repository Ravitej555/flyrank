'use client';

import { useState, useEffect, useCallback } from 'react';
import { FlightItinerary, RankingWeights } from '../types';
import { DEFAULT_WEIGHTS } from '../scoring';
import { FlightModel, SortCriterion, FlightFilterCriteria } from '../models/FlightModel';
import { POPULAR_ROUTES } from '../services/flightService';

export function useFlightSearchViewModel() {
  const [origin, setOrigin] = useState<string>('JFK');
  const [destination, setDestination] = useState<string>('LHR');
  const [date, setDate] = useState<string>('2026-10-15');
  const [passengers, setPassengers] = useState<number>(1);

  const [weights, setWeights] = useState<RankingWeights>(DEFAULT_WEIGHTS);
  const [sortBy, setSortBy] = useState<SortCriterion>('flyrank');
  const [filters, setFilters] = useState<FlightFilterCriteria>({
    maxStops: undefined,
    maxPrice: undefined,
    selectedAirlines: [],
    prioritizeDirect: false,
  });

  const [rawFlights, setRawFlights] = useState<FlightItinerary[]>([]);
  const [displayedFlights, setDisplayedFlights] = useState<FlightItinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [comparisonList, setComparisonList] = useState<FlightItinerary[]>([]);

  // Search flights function
  const executeSearch = useCallback(
    async (
      searchOrigin = origin,
      searchDestination = destination,
      currentWeights = weights,
      currentSort = sortBy
    ) => {
      setLoading(true);
      setError(null);
      try {
        const results = await FlightModel.getRankedFlights(
          { origin: searchOrigin, destination: searchDestination, date },
          currentWeights,
          currentSort
        );
        setRawFlights(results);
        const filtered = FlightModel.applyFilters(results, filters);
        setDisplayedFlights(filtered);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to search flights. Please try again.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [origin, destination, date, weights, sortBy, filters]
  );

  // Initial load
  useEffect(() => {
    executeSearch('JFK', 'LHR');
  }, []);

  // Recalculate rankings when weights change without refetching
  const updateWeights = useCallback(
    (newWeights: RankingWeights) => {
      setWeights(newWeights);
      if (rawFlights.length > 0) {
        const rescored = FlightModel.recalculateScores(rawFlights, newWeights, sortBy);
        setRawFlights(rescored);
        setDisplayedFlights(FlightModel.applyFilters(rescored, filters));
      }
    },
    [rawFlights, sortBy, filters]
  );

  // Update sorting
  const updateSortBy = useCallback(
    (criterion: SortCriterion) => {
      setSortBy(criterion);
      const sortedRaw = FlightModel.sortFlights(rawFlights, criterion);
      setRawFlights(sortedRaw);
      setDisplayedFlights(FlightModel.applyFilters(sortedRaw, filters));
    },
    [rawFlights, filters]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<FlightFilterCriteria>) => {
      const merged = { ...filters, ...newFilters };
      setFilters(merged);
      setDisplayedFlights(FlightModel.applyFilters(rawFlights, merged));
    },
    [filters, rawFlights]
  );

  // Quick route select
  const selectPopularRoute = useCallback(
    (newOrigin: string, newDestination: string) => {
      setOrigin(newOrigin);
      setDestination(newDestination);
      executeSearch(newOrigin, newDestination);
    },
    [executeSearch]
  );

  // Swap origin and destination
  const swapAirports = useCallback(() => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    executeSearch(destination, temp);
  }, [origin, destination, executeSearch]);

  // Comparison toggle
  const toggleComparison = useCallback((flight: FlightItinerary) => {
    setComparisonList((prev) => {
      const exists = prev.some((f) => f.flightId === flight.flightId);
      if (exists) {
        return prev.filter((f) => f.flightId !== flight.flightId);
      }
      if (prev.length >= 3) {
        // Keep max 3 flights in comparison
        return [...prev.slice(1), flight];
      }
      return [...prev, flight];
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    date,
    setDate,
    passengers,
    setPassengers,
    weights,
    updateWeights,
    sortBy,
    updateSortBy,
    filters,
    updateFilters,
    displayedFlights,
    rawFlightsCount: rawFlights.length,
    loading,
    error,
    executeSearch,
    selectPopularRoute,
    swapAirports,
    popularRoutes: POPULAR_ROUTES,
    comparisonList,
    toggleComparison,
    clearComparison,
  };
}
