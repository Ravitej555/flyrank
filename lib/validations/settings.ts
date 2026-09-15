import { z } from 'zod';
import { CurrencyCode, RankingWeights, UserPreferences } from '../types';

export const WEIGHT_TOLERANCE_EPSILON = 0.05;

export const RankingWeightsSchema = z
  .object({
    price: z.number().min(0, 'Price weight must be at least 0%').max(100, 'Price weight cannot exceed 100%'),
    duration: z.number().min(0, 'Duration weight must be at least 0%').max(100, 'Duration weight cannot exceed 100%'),
    layover: z.number().min(0, 'Layover weight must be at least 0%').max(100, 'Layover weight cannot exceed 100%'),
    carrier: z.number().min(0, 'Carrier weight must be at least 0%').max(100, 'Carrier weight cannot exceed 100%'),
    eco: z.number().min(0, 'Eco weight must be at least 0%').max(100, 'Eco weight cannot exceed 100%'),
  })
  .refine(
    (weights) => {
      const sum = weights.price + weights.duration + weights.layover + weights.carrier + weights.eco;
      return Math.abs(sum - 100) <= WEIGHT_TOLERANCE_EPSILON;
    },
    (weights) => {
      const sum = Math.round((weights.price + weights.duration + weights.layover + weights.carrier + weights.eco) * 10) / 10;
      return {
        message: `Ranking weights must sum to exactly 100% (currently ${sum}%).`,
        path: ['total'],
      };
    }
  );

export const CurrencyEnum = z.enum(['USD', 'EUR', 'GBP', 'INR'] satisfies [CurrencyCode, ...CurrencyCode[]]);

export const UserPreferencesSchema = z.object({
  weights: RankingWeightsSchema,
  currency: CurrencyEnum,
  maxStops: z.number().int('Stops must be an integer').min(0, 'Min stops is 0').max(3, 'Max stops is 3'),
  maxLayoverHours: z.number().min(1, 'Min layover is 1 hour').max(24, 'Max layover is 24 hours'),
  prioritizeDirect: z.boolean(),
  strictCarbonLimit: z.boolean(),
});

export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>;

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  weights: {
    price: 40,
    duration: 25,
    layover: 15,
    carrier: 10,
    eco: 10,
  },
  currency: 'USD',
  maxStops: 2,
  maxLayoverHours: 8,
  prioritizeDirect: false,
  strictCarbonLimit: false,
};
