import { FlightItinerary } from '../types';
import {
  getSavedFlights,
  saveFlight,
  removeSavedFlight,
  isFlightSaved,
} from '../services/savedFlightsService';

export interface FavouritesStats {
  totalCount: number;
  averageScore: number;
  averagePrice: number;
  averageDurationMinutes: number;
}

export class FavouritesModel {
  static loadFavourites(): FlightItinerary[] {
    return getSavedFlights();
  }

  static toggleFavourite(flight: FlightItinerary): { isSaved: boolean; updatedList: FlightItinerary[] } {
    if (isFlightSaved(flight.flightId)) {
      const updated = removeSavedFlight(flight.flightId);
      return { isSaved: false, updatedList: updated };
    } else {
      const updated = saveFlight(flight);
      return { isSaved: true, updatedList: updated };
    }
  }

  static removeFavourite(flightId: string): FlightItinerary[] {
    return removeSavedFlight(flightId);
  }

  static isSaved(flightId: string): boolean {
    return isFlightSaved(flightId);
  }

  static getStats(favourites: FlightItinerary[]): FavouritesStats {
    if (favourites.length === 0) {
      return {
        totalCount: 0,
        averageScore: 0,
        averagePrice: 0,
        averageDurationMinutes: 0,
      };
    }

    const totalScore = favourites.reduce((acc, f) => acc + (f.flyrankScore ?? 0), 0);
    const totalPrice = favourites.reduce((acc, f) => acc + f.price, 0);
    const totalDuration = favourites.reduce((acc, f) => acc + f.totalDurationMinutes, 0);

    return {
      totalCount: favourites.length,
      averageScore: Math.round((totalScore / favourites.length) * 10) / 10,
      averagePrice: Math.round(totalPrice / favourites.length),
      averageDurationMinutes: Math.round(totalDuration / favourites.length),
    };
  }
}
