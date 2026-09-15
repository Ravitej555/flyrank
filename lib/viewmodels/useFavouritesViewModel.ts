'use client';

import { useState, useEffect, useCallback } from 'react';
import { FlightItinerary } from '../types';
import { FavouritesModel, FavouritesStats } from '../models/FavouritesModel';

export function useFavouritesViewModel() {
  const [favourites, setFavourites] = useState<FlightItinerary[]>([]);
  const [stats, setStats] = useState<FavouritesStats>({
    totalCount: 0,
    averageScore: 0,
    averagePrice: 0,
    averageDurationMinutes: 0,
  });

  const refreshFavourites = useCallback(() => {
    const list = FavouritesModel.loadFavourites();
    setFavourites(list);
    setStats(FavouritesModel.getStats(list));
  }, []);

  useEffect(() => {
    refreshFavourites();

    // Listen for storage events across tabs or local updates
    const handleStorage = () => refreshFavourites();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshFavourites]);

  const toggleFavourite = useCallback(
    (flight: FlightItinerary) => {
      const result = FavouritesModel.toggleFavourite(flight);
      setFavourites(result.updatedList);
      setStats(FavouritesModel.getStats(result.updatedList));
      return result.isSaved;
    },
    []
  );

  const removeFavourite = useCallback((flightId: string) => {
    const updated = FavouritesModel.removeFavourite(flightId);
    setFavourites(updated);
    setStats(FavouritesModel.getStats(updated));
  }, []);

  const isSaved = useCallback(
    (flightId: string) => {
      return favourites.some((f) => f.flightId === flightId);
    },
    [favourites]
  );

  return {
    favourites,
    stats,
    toggleFavourite,
    removeFavourite,
    isSaved,
    refreshFavourites,
  };
}
