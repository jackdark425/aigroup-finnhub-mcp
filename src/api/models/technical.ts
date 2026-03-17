import { z } from 'zod';

// Technical Indicator
export const TechnicalIndicatorSchema = z.object({
  indicator: z.array(z.number().nullable()),
  indicator_name: z.string(),
});

export type TechnicalIndicator = z.infer<typeof TechnicalIndicatorSchema>;

// Aggregate Signals
export const AggregateSignalsSchema = z.object({
  symbol: z.string(),
  technicalAnalysis: z.object({
    count: z.object({
      buy: z.number(),
      neutral: z.number(),
      sell: z.number(),
    }),
    signal: z.enum(['buy', 'sell', 'neutral']),
  }),
  trend: z.object({
    adx: z.number(),
    trending: z.boolean(),
  }),
});

export type AggregateSignals = z.infer<typeof AggregateSignalsSchema>;

// Pattern Recognition
export const PatternSchema = z.object({
  patternName: z.string(),
  patternType: z.enum(['bullish', 'bearish', 'neutral']),
  endDatetime: z.number(),
  endPrice: z.number(),
  mature: z.boolean(),
  startDatetime: z.number(),
  startPrice: z.number(),
  confirmed: z.boolean().optional(),
  entryPoint: z.number().optional(),
  target: z.number().optional(),
  stopLoss: z.number().optional(),
});

export type Pattern = z.infer<typeof PatternSchema>;

export const PatternRecognitionSchema = z.object({
  symbol: z.string(),
  resolution: z.string(),
  patterns: z.array(PatternSchema),
});

export type PatternRecognition = z.infer<typeof PatternRecognitionSchema>;

// Support/Resistance
export const SupportResistanceSchema = z.object({
  levels: z.array(z.number()),
});

export type SupportResistance = z.infer<typeof SupportResistanceSchema>;
