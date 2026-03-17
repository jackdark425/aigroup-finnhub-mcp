import { z } from 'zod';

// Basic Financials
export const BasicFinancialsSchema = z.object({
  symbol: z.string(),
  metricType: z.string().optional(),
  series: z.record(z.array(z.object({
    period: z.string(),
    v: z.number(),
  }))).optional(),
  metric: z.record(z.number()).optional(),
});

export type BasicFinancials = z.infer<typeof BasicFinancialsSchema>;

// Financial Report
export const FinancialReportSchema = z.object({
  symbol: z.string(),
  cik: z.string().optional(),
  accessNumber: z.string(),
  year: z.number(),
  quarter: z.number(),
  form: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  filedDate: z.string(),
  acceptedDate: z.string(),
  report: z.record(z.unknown()).optional(),
});

export type FinancialReport = z.infer<typeof FinancialReportSchema>;

// Dividends
export const DividendSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  amount: z.number(),
  adjustedAmount: z.number().optional(),
  payDate: z.string().optional(),
  recordDate: z.string().optional(),
  declarationDate: z.string().optional(),
  currency: z.string().optional(),
});

export type Dividend = z.infer<typeof DividendSchema>;

// Stock Split
export const StockSplitSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  fromFactor: z.number(),
  toFactor: z.number(),
});

export type StockSplit = z.infer<typeof StockSplitSchema>;

// Revenue Breakdown
export const RevenueBreakdownSchema = z.object({
  symbol: z.string(),
  cik: z.string().optional(),
  data: z.array(z.object({
    year: z.number(),
    quarter: z.number(),
    segment: z.string(),
    revenue: z.number(),
    geography: z.string().optional(),
  })),
});

export type RevenueBreakdown = z.infer<typeof RevenueBreakdownSchema>;
