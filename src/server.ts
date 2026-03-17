import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { getConfig, isToolEnabled } from './config.js';
import { getLogger } from './utils/logger.js';
import * as stockMarketData from './tools/stock_market_data.js';
import * as technicalAnalysis from './tools/technical_analysis.js';
import * as newsSentiment from './tools/news_sentiment.js';
import * as fundamentals from './tools/fundamentals.js';
import * as cryptoData from './tools/crypto_data.js';
import * as stockEstimates from './tools/stock_estimates.js';
import * as stockOwnership from './tools/stock_ownership.js';
import * as alternativeData from './tools/alternative_data.js';
import * as secFilings from './tools/sec_filings.js';
import * as forexData from './tools/forex_data.js';
import * as calendarData from './tools/calendar_data.js';
import * as marketEvents from './tools/market_events.js';
import * as projectCreate from './tools/project_create.js';
import * as projectList from './tools/project_list.js';
import * as jobStatus from './tools/job_status.js';

const logger = getLogger('Server');

// Define all available tools with their handlers
const toolRegistry: Record<string, { definition: Tool; handler: (args: unknown) => Promise<unknown> }> = {};

// Helper to register tool operations
function registerToolOperations(
  _toolName: string,
  toolDef: { name: string; description: string; operations: Array<{ name: string; description: string; parameters: unknown }> },
  operationHandlers: Record<string, (args: unknown) => Promise<unknown>>
): void {
  toolRegistry[toolDef.name] = {
    definition: {
      name: toolDef.name,
      description: `${toolDef.description}. Operations: ${toolDef.operations.map(o => o.name).join(', ')}`,
      inputSchema: {
        type: 'object',
        properties: {
          operation: { type: 'string', enum: toolDef.operations.map(o => o.name) },
          ...toolDef.operations.reduce((acc, op) => {
            const params = (op.parameters as Record<string, unknown>)?.properties || {};
            Object.entries(params).forEach(([key, value]) => {
              if (key !== 'operation' && !acc[key]) {
                acc[key] = value;
              }
            });
            return acc;
          }, {} as Record<string, unknown>),
        },
        required: ['operation'],
      },
    },
    handler: async (args: unknown): Promise<unknown> => {
      const { operation, ...params } = args as { operation: string };
      const handler = operationHandlers[operation];
      if (!handler) {
        throw new Error(`Unknown operation: ${operation}`);
      }
      return handler(params);
    },
  };
}

// Register all tools
if (isToolEnabled('stock_market_data')) {
  registerToolOperations('stock_market_data', stockMarketData.stockMarketDataTool, {
    get_quote: stockMarketData.getQuote,
    get_candles: stockMarketData.getCandles,
    get_company_profile: stockMarketData.getCompanyProfile,
    symbol_lookup: stockMarketData.symbolLookup,
    get_basic_financials: stockMarketData.getBasicFinancials,
    get_financials_as_reported: stockMarketData.getFinancialsAsReported,
    get_earnings_surprises: stockMarketData.getEarningsSurprises,
  });
}

if (isToolEnabled('technical_analysis')) {
  registerToolOperations('technical_analysis', technicalAnalysis.technicalAnalysisTool, {
    get_indicator: technicalAnalysis.getTechnicalIndicator,
    get_aggregate_signals: technicalAnalysis.getAggregateSignals,
    get_pattern_recognition: technicalAnalysis.getPatternRecognition,
    get_support_resistance: technicalAnalysis.getSupportResistance,
  });
}

if (isToolEnabled('news_sentiment')) {
  registerToolOperations('news_sentiment', newsSentiment.newsSentimentTool, {
    get_company_news: newsSentiment.getCompanyNews,
    get_market_news: newsSentiment.getMarketNews,
    get_news_sentiment: newsSentiment.getNewsSentiment,
    get_insider_sentiment: newsSentiment.getInsiderSentiment,
  });
}

if (isToolEnabled('stock_fundamentals')) {
  registerToolOperations('stock_fundamentals', fundamentals.fundamentalsTool, {
    get_basic_financials: fundamentals.getBasicFinancials,
    get_financials_as_reported: fundamentals.getFinancialsAsReported,
    get_dividends: fundamentals.getDividends,
    get_stock_splits: fundamentals.getStockSplits,
    get_revenue_breakdown: fundamentals.getRevenueBreakdown,
  });
}

if (isToolEnabled('crypto_data')) {
  registerToolOperations('crypto_data', cryptoData.cryptoDataTool, {
    get_exchanges: cryptoData.getCryptoExchanges,
    get_symbols: cryptoData.getCryptoSymbols,
    get_quote: cryptoData.getCryptoQuote,
    get_candles: cryptoData.getCryptoCandles,
  });
}

if (isToolEnabled('stock_estimates')) {
  registerToolOperations('stock_estimates', stockEstimates.stockEstimatesTool, {
    get_earnings_estimates: stockEstimates.getEarningsEstimates,
    get_revenue_estimates: stockEstimates.getRevenueEstimates,
    get_ebitda_estimates: stockEstimates.getEbitdaEstimates,
    get_price_target: stockEstimates.getPriceTarget,
    get_recommendation_trends: stockEstimates.getRecommendationTrends,
  });
}

if (isToolEnabled('stock_ownership')) {
  registerToolOperations('stock_ownership', stockOwnership.stockOwnershipTool, {
    get_insider_transactions: stockOwnership.getInsiderTransactions,
    get_institutional_ownership: stockOwnership.getInstitutionalOwnership,
    get_institutional_portfolio: stockOwnership.getInstitutionalPortfolio,
    get_congress_transactions: stockOwnership.getCongressTransactions,
  });
}

if (isToolEnabled('alternative_data')) {
  registerToolOperations('alternative_data', alternativeData.alternativeDataTool, {
    get_esg_score: alternativeData.getESGScore,
    get_social_sentiment: alternativeData.getSocialSentiment,
    get_supply_chain: alternativeData.getSupplyChain,
    get_patents: alternativeData.getPatents,
  });
}

if (isToolEnabled('sec_filings')) {
  registerToolOperations('sec_filings', secFilings.secFilingsTool, {
    get_sec_filings: secFilings.getSECFilings,
    get_filing_sentiment: secFilings.getFilingSentiment,
    get_similarity_index: secFilings.getSimilarityIndex,
  });
}

if (isToolEnabled('forex_data')) {
  registerToolOperations('forex_data', forexData.forexDataTool, {
    get_exchanges: forexData.getForexExchanges,
    get_symbols: forexData.getForexSymbols,
    get_rate: forexData.getForexRate,
    get_candles: forexData.getForexCandles,
  });
}

if (isToolEnabled('calendar_data')) {
  registerToolOperations('calendar_data', calendarData.calendarDataTool, {
    get_ipo_calendar: calendarData.getIPOCalendar,
    get_earnings_calendar: calendarData.getEarningsCalendar,
    get_economic_calendar: calendarData.getEconomicCalendar,
    get_fda_calendar: calendarData.getFDACalendar,
  });
}

if (isToolEnabled('market_events')) {
  registerToolOperations('market_events', marketEvents.marketEventsTool, {
    get_market_holidays: marketEvents.getMarketHolidays,
    get_analyst_ratings: marketEvents.getAnalystRatings,
    get_merger_acquisitions: marketEvents.getMergerAcquisitions,
  });
}

if (isToolEnabled('project_create')) {
  registerToolOperations('project_create', projectCreate.projectCreateTool, {
    create: projectCreate.createProject,
  });
}

if (isToolEnabled('project_list')) {
  registerToolOperations('project_list', projectList.projectListTool, {
    list: projectList.listProjects,
  });
}

if (isToolEnabled('job_status')) {
  registerToolOperations('job_status', jobStatus.jobStatusTool, {
    get: jobStatus.getJobStatus,
  });
}

export function createServer(): Server {
  const config = getConfig();
  
  logger.info('Creating MCP server with config:', {
    toolsEnabled: Object.entries(config.tools)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name),
  });

  const server = new Server(
    {
      name: 'aigroup-finnhub-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, () => {
    return {
      tools: Object.values(toolRegistry).map(t => t.definition),
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    logger.info(`Tool call: ${name}`, { args });

    const tool = toolRegistry[name];
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      const result = await tool.handler(args ?? {});
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error(`Error executing tool ${name}:`, error);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  logger.info('Starting MCP server...');
  
  await server.connect(transport);
  
  logger.info('MCP server started and listening on stdio');
}
