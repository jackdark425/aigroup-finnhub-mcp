# aigroup-finnhub-mcp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Node.js implementation of the MCP (Model Context Protocol) server for Finnhub financial data API.

## Quick Start with npx

```bash
npx aigroup-finnhub-mcp
```

Or with environment variables:
```bash
FINNHUB_API_KEY=your_api_key npx aigroup-finnhub-mcp
```

## Features

- **15 MCP Tools**: Complete set of financial data tools
- **TypeScript**: Full type safety with Zod validation
- **Rate Limiting**: Built-in token bucket rate limiter
- **Retry Logic**: Exponential backoff with jitter
- **Error Handling**: Comprehensive error types and handling

## Available Tools

| Tool | Operations | Description |
|------|-----------|-------------|
| `finnhub_stock_market_data` | 7 | Quotes, candles, profiles, financials |
| `finnhub_technical_analysis` | 4 | 50+ indicators, patterns, signals |
| `finnhub_news_sentiment` | 4 | News, sentiment analysis |
| `finnhub_stock_fundamentals` | 5 | Financial metrics, dividends, splits |
| `finnhub_crypto_data` | 4 | Crypto exchanges, symbols, prices |

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Finnhub API key:
```
FINNHUB_API_KEY=your_api_key_here
```

Get your API key at [Finnhub Dashboard](https://finnhub.io/dashboard).

## Usage

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### MCP Configuration (npx)

Add to your Claude Desktop config (`%APPDATA%\\Claude\\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "aigroup-finnhub": {
      "command": "npx",
      "args": ["-y", "aigroup-finnhub-mcp"],
      "env": {
        "FINNHUB_API_KEY": "your_finnhub_api_key_here"
      }
    }
  }
}
```

Or using local path:
```json
{
  "mcpServers": {
    "aigroup-finnhub": {
      "command": "node",
      "args": ["D:/mcp-finnhub-main/mcp-finnhub-node/dist/index.js"],
      "env": {
        "FINNHUB_API_KEY": "d6j77dpr01ql467igom0d6j77dpr01ql467igomg"
      }
    }
  }
}
```

## API Reference

### finnhub_stock_market_data

Operations:
- `get_quote` - Real-time stock quote
- `get_candles` - Historical OHLCV data
- `get_company_profile` - Company information
- `symbol_lookup` - Search symbols
- `get_basic_financials` - Financial metrics
- `get_financials_as_reported` - SEC financial statements
- `get_earnings_surprises` - Earnings surprises

### finnhub_technical_analysis

Operations:
- `get_indicator` - Technical indicators (RSI, MACD, etc.)
- `get_aggregate_signals` - Buy/sell/neutral signals
- `get_pattern_recognition` - Chart patterns
- `get_support_resistance` - S/R levels

### finnhub_news_sentiment

Operations:
- `get_company_news` - Company news articles
- `get_market_news` - General market news
- `get_news_sentiment` - News sentiment scores
- `get_insider_sentiment` - Insider trading sentiment

## Development

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Test
npm run test
```

## License & Usage

This project is released under the **MIT License**.

You may use, copy, modify, merge, publish, distribute, sublicense, and sell copies of this software, including for commercial use, as long as the original copyright notice and license text are preserved.

Please note:

- the software is provided **"AS IS"**, without warranty of any kind
- you must retain the license and copyright notice in copies or substantial portions of the software
- usage of the **Finnhub API** remains subject to Finnhub's own terms of service, rate limits, and data licensing restrictions

See the full text in [LICENSE](LICENSE).
