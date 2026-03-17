import { z } from 'zod';

// Market Holiday
export const MarketHolidaySchema = z.object({
  exchange: z.string(),
  date: z.string(),
  holiday: z.string(),
  status: z.enum(['open', 'closed']),
});

export type MarketHoliday = z.infer<typeof MarketHolidaySchema>;

// Analyst Rating
export const AnalystRatingSchema = z.object({
  symbol: z.string(),
  analyst: z.string(),
  rating: z.string(),
  previousRating: z.string().optional(),
  action: z.enum(['upgraded', 'downgraded', 'initiated', 'reiterated']),
  priceTarget: z.number().optional(),
  previousPriceTarget: z.number().optional(),
  date: z.string(),
});

export type AnalystRating = z.infer<typeof AnalystRatingSchema>;

// Merger/Acquisition
export const MergerAcquisitionSchema = z.object({
  symbol: z.string(),
  targetSymbol: z.string().optional(),
  acquirerSymbol: z.string().optional(),
  dealType: z.enum(['acquisition', 'merger', 'buyout']),
  dealValue: z.number().optional(),
  dealCurrency: z.string().optional(),
  dealStatus: z.enum(['announced', 'pending', 'completed', 'cancelled']),
  announcedDate: z.string(),
  expectedCloseDate: z.string().optional(),
});

export type MergerAcquisition = z.infer<typeof MergerAcquisitionSchema>;
