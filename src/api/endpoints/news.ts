import { getFinnhubClient } from '../client.js';
import type { NewsItem, NewsSentiment, InsiderSentiment } from '../models/index.js';

const client = getFinnhubClient();

export async function getCompanyNews(
  symbol: string,
  from: string,
  to: string
): Promise<NewsItem[]> {
  return client.get<NewsItem[]>('/company-news', {
    symbol: symbol.toUpperCase(),
    from,
    to,
  });
}

export async function getMarketNews(category: string = 'general'): Promise<NewsItem[]> {
  return client.get<NewsItem[]>('/news', { category });
}

export async function getNewsSentiment(symbol: string): Promise<NewsSentiment> {
  return client.get<NewsSentiment>('/news-sentiment', { 
    symbol: symbol.toUpperCase() 
  });
}

export async function getInsiderSentiment(
  symbol: string,
  from: string,
  to: string
): Promise<InsiderSentiment> {
  return client.get<InsiderSentiment>('/stock/insider-sentiment', {
    symbol: symbol.toUpperCase(),
    from,
    to,
  });
}

export async function getMajorPressReleases(symbol: string): Promise<unknown> {
  return client.get('/stock/press-releases', { 
    symbol: symbol.toUpperCase() 
  });
}
