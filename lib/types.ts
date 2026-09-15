export interface RankingWeights {
  price: number;       // e.g. 40
  duration: number;    // e.g. 25
  layover: number;     // e.g. 15
  carrier: number;     // e.g. 10
  eco: number;         // e.g. 10
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface UserPreferences {
  weights: RankingWeights;
  currency: CurrencyCode;
  maxStops: number;
  maxLayoverHours: number;
  prioritizeDirect: boolean;
  strictCarbonLimit: boolean;
}

export interface ScoreBreakdown {
  priceScore: number;
  durationScore: number;
  layoverScore: number;
  carrierScore: number;
  ecoScore: number;
}

export interface FlightItinerary {
  flightId: string;
  airline: string;
  flightNumber: string;
  price: number;
  currency: CurrencyCode;
  totalDurationMinutes: number;
  stops: number;
  layoverDurationMinutes: number;
  carrierRating: number; // 0-10
  co2EmissionsKg: number;
  flyrankScore?: number;
  scoreBreakdown?: ScoreBreakdown;
}
