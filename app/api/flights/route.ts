import { NextRequest, NextResponse } from "next/server";
import { fetchFlights } from "@/lib/services/flightService";
import { computeFlyRankScore, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { CurrencyCode, RankingWeights } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin") || "JFK";
  const destination = searchParams.get("destination") || "LHR";
  const maxStopsParam = searchParams.get("maxStops");
  const currencyParam = (searchParams.get("currency") || "USD") as CurrencyCode;
  const sortParam = searchParams.get("sort") || "flyrank";

  const maxStops = maxStopsParam !== null ? parseInt(maxStopsParam, 10) : undefined;

  // Optional custom weights from query params
  const weights: RankingWeights = {
    price: searchParams.has("w_price")
      ? Number(searchParams.get("w_price"))
      : DEFAULT_WEIGHTS.price,
    duration: searchParams.has("w_duration")
      ? Number(searchParams.get("w_duration"))
      : DEFAULT_WEIGHTS.duration,
    layover: searchParams.has("w_layover")
      ? Number(searchParams.get("w_layover"))
      : DEFAULT_WEIGHTS.layover,
    carrier: searchParams.has("w_carrier")
      ? Number(searchParams.get("w_carrier"))
      : DEFAULT_WEIGHTS.carrier,
    eco: searchParams.has("w_eco")
      ? Number(searchParams.get("w_eco"))
      : DEFAULT_WEIGHTS.eco,
  };

  try {
    const rawFlights = await fetchFlights({
      origin,
      destination,
      maxStops: isNaN(maxStops as number) ? undefined : maxStops,
      currency: currencyParam,
    });

    // Score flights
    let scoredFlights = rawFlights.map((flight) => {
      const { score, breakdown } = computeFlyRankScore(flight, weights);
      return {
        ...flight,
        flyrankScore: score,
        scoreBreakdown: breakdown,
      };
    });

    // Apply sorting
    if (sortParam === "price") {
      scoredFlights.sort((a, b) => a.price - b.price);
    } else if (sortParam === "duration") {
      scoredFlights.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    } else if (sortParam === "eco") {
      scoredFlights.sort((a, b) => a.co2EmissionsKg - b.co2EmissionsKg);
    } else if (sortParam === "carrier") {
      scoredFlights.sort((a, b) => b.carrierRating - a.carrierRating);
    } else {
      // Default flyrank score descending
      scoredFlights.sort((a, b) => (b.flyrankScore ?? 0) - (a.flyrankScore ?? 0));
    }

    return NextResponse.json({
      meta: {
        origin,
        destination,
        currency: currencyParam,
        count: scoredFlights.length,
        appliedWeights: weights,
      },
      flights: scoredFlights,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch and score flights" },
      { status: 500 }
    );
  }
}
