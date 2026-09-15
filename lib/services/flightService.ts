import { CurrencyCode, FlightItinerary } from '../types';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  date?: string;
  maxStops?: number;
  currency?: CurrencyCode;
}

// Curated realistic route presets
export const POPULAR_ROUTES = [
  { origin: 'JFK', destination: 'LHR', label: 'New York (JFK) ⇄ London (LHR)' },
  { origin: 'SFO', destination: 'HND', label: 'San Francisco (SFO) ⇄ Tokyo (HND)' },
  { origin: 'DXB', destination: 'CDG', label: 'Dubai (DXB) ⇄ Paris (CDG)' },
  { origin: 'BLR', destination: 'SIN', label: 'Bengaluru (BLR) ⇄ Singapore (SIN)' },
  { origin: 'ORD', destination: 'FRA', label: 'Chicago (ORD) ⇄ Frankfurt (FRA)' },
];

// Seed generator for realistic, deterministic flight options across international routes
export const MOCK_FLIGHT_CATALOG: FlightItinerary[] = [
  {
    flightId: 'FL-101',
    airline: 'British Airways',
    flightNumber: 'BA 178',
    price: 540,
    currency: 'USD',
    totalDurationMinutes: 420, // 7h 0m
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 8.8,
    co2EmissionsKg: 210,
  },
  {
    flightId: 'FL-102',
    airline: 'Norse Atlantic',
    flightNumber: 'N0 302',
    price: 340, // ultra-budget
    currency: 'USD',
    totalDurationMinutes: 450,
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 6.9,
    co2EmissionsKg: 240,
  },
  {
    flightId: 'FL-103',
    airline: 'Virgin Atlantic',
    flightNumber: 'VS 26',
    price: 590,
    currency: 'USD',
    totalDurationMinutes: 430,
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 9.1,
    co2EmissionsKg: 195, // eco-efficient A350
  },
  {
    flightId: 'FL-104',
    airline: 'Air France',
    flightNumber: 'AF 023',
    price: 430,
    currency: 'USD',
    totalDurationMinutes: 610, // 1 stop in CDG
    stops: 1,
    layoverDurationMinutes: 110, // comfortable 1h50m layover
    carrierRating: 8.4,
    co2EmissionsKg: 260,
  },
  {
    flightId: 'FL-105',
    airline: 'Icelandair',
    flightNumber: 'FI 614',
    price: 380,
    currency: 'USD',
    totalDurationMinutes: 720,
    stops: 1,
    layoverDurationMinutes: 50, // tight connection risk! (<60m)
    carrierRating: 7.8,
    co2EmissionsKg: 290,
  },
  {
    flightId: 'FL-106',
    airline: 'Lufthansa',
    flightNumber: 'LH 401',
    price: 620,
    currency: 'USD',
    totalDurationMinutes: 890,
    stops: 1,
    layoverDurationMinutes: 340, // long fatigue layover (>5h)
    carrierRating: 8.5,
    co2EmissionsKg: 310,
  },
  {
    flightId: 'FL-107',
    airline: 'Singapore Airlines',
    flightNumber: 'SQ 025',
    price: 680,
    currency: 'USD',
    totalDurationMinutes: 425,
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 9.7,
    co2EmissionsKg: 190,
  },
  {
    flightId: 'FL-108',
    airline: 'Emirates',
    flightNumber: 'EK 202',
    price: 710,
    currency: 'USD',
    totalDurationMinutes: 790,
    stops: 1,
    layoverDurationMinutes: 140,
    carrierRating: 9.4,
    co2EmissionsKg: 275,
  },
  {
    flightId: 'FL-109',
    airline: 'Delta Air Lines',
    flightNumber: 'DL 001',
    price: 520,
    currency: 'USD',
    totalDurationMinutes: 440,
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 8.6,
    co2EmissionsKg: 220,
  },
  {
    flightId: 'FL-110',
    airline: 'TAP Air Portugal',
    flightNumber: 'TP 104',
    price: 360,
    currency: 'USD',
    totalDurationMinutes: 850,
    stops: 2,
    layoverDurationMinutes: 280,
    carrierRating: 7.2,
    co2EmissionsKg: 340,
  },
  {
    flightId: 'FL-111',
    airline: 'All Nippon Airways (ANA)',
    flightNumber: 'NH 007',
    price: 790,
    currency: 'USD',
    totalDurationMinutes: 620,
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 9.6,
    co2EmissionsKg: 215,
  },
  {
    flightId: 'FL-112',
    airline: 'United Airlines',
    flightNumber: 'UA 875',
    price: 510,
    currency: 'USD',
    totalDurationMinutes: 460,
    stops: 0,
    layoverDurationMinutes: 0,
    carrierRating: 8.1,
    co2EmissionsKg: 235,
  },
];

/**
 * Simulates fetching flights from an aggregator API or internal flight service.
 * Includes latency simulation to represent real-world network requests.
 */
export async function fetchFlights(params?: FlightSearchParams): Promise<FlightItinerary[]> {
  // Simulate network roundtrip latency (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));

  let results = [...MOCK_FLIGHT_CATALOG];

  if (params?.maxStops !== undefined) {
    results = results.filter((f) => f.stops <= params.maxStops!);
  }

  // Adjust prices if currency is not USD
  if (params?.currency && params.currency !== 'USD') {
    const rates: Record<CurrencyCode, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.78,
      INR: 84.5,
    };
    const rate = rates[params.currency] || 1.0;
    results = results.map((f) => ({
      ...f,
      currency: params.currency!,
      price: Math.round(f.price * rate),
    }));
  }

  return results;
}
