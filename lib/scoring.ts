import { FlightItinerary, RankingWeights, ScoreBreakdown } from './types';

export const DEFAULT_WEIGHTS: RankingWeights = {
  price: 40,
  duration: 25,
  layover: 15,
  carrier: 10,
  eco: 10,
};

export function computeFlyRankScore(
  flight: FlightItinerary,
  weights: RankingWeights = DEFAULT_WEIGHTS
): { score: number; breakdown: ScoreBreakdown } {
  // Normalize price (benchmark: $1000 = 0, $200 = 100)
  const priceNorm = Math.max(0, Math.min(100, 100 - ((flight.price - 200) / 800) * 100));

  // Normalize duration (benchmark: 18h = 0, 2h = 100)
  const durationNorm = Math.max(0, Math.min(100, 100 - ((flight.totalDurationMinutes - 120) / 960) * 100));

  // Layover score (0 stops = 100; layover 1h-2h = 80; >4h = penalty)
  let layoverNorm = 100;
  if (flight.stops > 0) {
    if (flight.layoverDurationMinutes < 60) {
      layoverNorm = 40; // Tight connection risk
    } else if (flight.layoverDurationMinutes <= 180) {
      layoverNorm = 85;
    } else {
      layoverNorm = Math.max(10, 85 - ((flight.layoverDurationMinutes - 180) / 300) * 60);
    }
  }

  // Carrier rating (0-10 -> 0-100)
  const carrierNorm = Math.max(0, Math.min(100, flight.carrierRating * 10));

  // Eco score (benchmark: 500kg = 0, 50kg = 100)
  const ecoNorm = Math.max(0, Math.min(100, 100 - ((flight.co2EmissionsKg - 50) / 450) * 100));

  const totalWeight = weights.price + weights.duration + weights.layover + weights.carrier + weights.eco;
  const safeTotalWeight = totalWeight > 0 ? totalWeight : 100;

  const compositeScore = (
    weights.price * priceNorm +
    weights.duration * durationNorm +
    weights.layover * layoverNorm +
    weights.carrier * carrierNorm +
    weights.eco * ecoNorm
  ) / safeTotalWeight;

  return {
    score: Math.round(compositeScore * 10) / 10,
    breakdown: {
      priceScore: Math.round(priceNorm * 10) / 10,
      durationScore: Math.round(durationNorm * 10) / 10,
      layoverScore: Math.round(layoverNorm * 10) / 10,
      carrierScore: Math.round(carrierNorm * 10) / 10,
      ecoScore: Math.round(ecoNorm * 10) / 10,
    },
  };
}
