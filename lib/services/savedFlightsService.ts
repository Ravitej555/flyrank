import { FlightItinerary } from '../types';

const STORAGE_KEY = 'flyrank_saved_flights_v1';

// In-memory fallback for SSR or environments without localStorage
let inMemoryFavorites: FlightItinerary[] = [];

export function getSavedFlights(): FlightItinerary[] {
  if (typeof window === 'undefined') {
    return inMemoryFavorites;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FlightItinerary[];
  } catch (err) {
    console.warn('Failed to parse saved flights from localStorage:', err);
    return inMemoryFavorites;
  }
}

export function saveFlight(flight: FlightItinerary): FlightItinerary[] {
  const current = getSavedFlights();
  const exists = current.some((f) => f.flightId === flight.flightId);
  const updated = exists ? current : [flight, ...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to persist saved flight to localStorage:', err);
    }
  } else {
    inMemoryFavorites = updated;
  }
  return updated;
}

export function removeSavedFlight(flightId: string): FlightItinerary[] {
  const current = getSavedFlights();
  const updated = current.filter((f) => f.flightId !== flightId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to remove saved flight from localStorage:', err);
    }
  } else {
    inMemoryFavorites = updated;
  }
  return updated;
}

export function isFlightSaved(flightId: string): boolean {
  const current = getSavedFlights();
  return current.some((f) => f.flightId === flightId);
}
