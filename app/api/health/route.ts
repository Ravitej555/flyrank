import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();
  
  // Simulate memory & service telemetry check
  const healthData = {
    status: "healthy",
    version: "0.1.0-w3",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      scoringEngine: {
        status: "operational",
        latencyMs: 1.2,
      },
      flightCatalog: {
        status: "operational",
        totalRoutes: 5,
        totalMockFlights: 12,
      },
      authService: {
        status: "operational",
        mode: "demo_guest_ready",
      },
      localStoragePersistence: {
        status: "operational",
        storageKey: "flyrank_saved_flights_v1",
      },
    },
    latencyMs: Date.now() - startTime,
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
