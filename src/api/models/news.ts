import { z } from 'zod';

// News Item
export const NewsItemSchema = z.object({
  category: z.string(),
  datetime: z.number(),
  headline: z.string(),
  id: z.number(),
  image: z.string(),
  related: z.string(),
  source: z.string(),
  summary: z.string(),
  url: z.string(),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

// News Sentiment
export const NewsSentimentSchema = z.object({
  symbol: z.string(),
  companyNewsScore: z.number(),
  sectorAverageNewsScore: z.number(),
  sectorAverageBullishPercent: z.number().optional(),
  sectorAverageEventScore: z.number().optional(),
  sentiment: z.object({
    bearishPercent: z.number(),
    bullishPercent: z.number(),
  }),
  buzz: z.object({
    articlesInLastWeek: z.number(),
    buzz: z.number(),
    weeklyAverage: z.number(),
  }),
});

export type NewsSentiment = z.infer<typeof NewsSentimentSchema>;

// Insider Sentiment
export const InsiderSentimentSchema = z.object({
  symbol: z.string(),
  data: z.array(z.object({
    change: z.number(),
    month: z.number(),
    mspr: z.number(),
    year: z.number(),
  })),
});

export type InsiderSentiment = z.infer<typeof InsiderSentimentSchema>;
