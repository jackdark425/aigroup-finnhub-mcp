# aigroup-finnhub-mcp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-1.2.1-brightgreen.svg)](https://github.com/jackdark425/aigroup-finnhub-mcp)

> Node.js MCP server for Finnhub financial market data.

## Overview

`aigroup-finnhub-mcp` provides a practical MCP wrapper around the Finnhub API for:

- stock quotes and candles
- company profiles and fundamentals
- technical indicators and trading signals
- news, sentiment, and insider sentiment
- crypto market data

## Highlights

- **15 MCP tools** grouped by market data, technical analysis, fundamentals, news, and crypto
- **TypeScript + Zod validation** for safer input handling
- **Built-in rate limiting** with retry logic
- **Structured error handling** for more reliable downstream use
- **Designed for MCP clients** such as Claude Desktop and similar tools

## Quick Start

### Requirements

- Node.js >= 18
- npm
- A valid Finnhub API key

### Install and build

```bash
git clone https://github.com/jackdark425/aigroup-finnhub-mcp.git
cd aigroup-finnhub-mcp
npm install
npm run build
```

### Configure API key

```bash
FINNHUB_API_KEY=your_api_key_here npm start
```

You can get an API key from [Finnhub Dashboard](https://finnhub.io/dashboard).

## Configuration

If you use a local `.env` file:

```bash
cp .env.example .env
```

Then set:

```env
FINNHUB_API_KEY=your_api_key_here
```

## MCP Client Configuration

### Using npx

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

### Using local build output

```json
{
  "mcpServers": {
    "aigroup-finnhub": {
      "command": "node",
      "args": ["/path/to/aigroup-finnhub-mcp/dist/index.js"],
      "env": {
        "FINNHUB_API_KEY": "your_finnhub_api_key_here"
      }
    }
  }
}
```

## Tool Groups

| Tool | Operations | Description |
|------|-----------:|-------------|
| `finnhub_stock_market_data` | 7 | Quotes, candles, profiles, financials |
| `finnhub_technical_analysis` | 4 | Indicators, patterns, signals |
| `finnhub_news_sentiment` | 4 | News and sentiment workflows |
| `finnhub_stock_fundamentals` | 5 | Financial metrics, dividends, splits |
| `finnhub_crypto_data` | 4 | Crypto exchanges, symbols, prices |

## API Reference

### `finnhub_stock_market_data`
- `get_quote`
- `get_candles`
- `get_company_profile`
- `symbol_lookup`
- `get_basic_financials`
- `get_financials_as_reported`
- `get_earnings_surprises`

### `finnhub_technical_analysis`
- `get_indicator`
- `get_aggregate_signals`
- `get_pattern_recognition`
- `get_support_resistance`

### `finnhub_news_sentiment`
- `get_company_news`
- `get_market_news`
- `get_news_sentiment`
- `get_insider_sentiment`

## Development

```bash
npm run typecheck
npm run lint
npm run test
```

## Acknowledgments

### Reference Project

- **cfdude/mcp-finnhub**
  - Repository: https://github.com/cfdude/mcp-finnhub
  - Reference scope: overall project direction, MCP server structure, and interface organization

Thanks to **cfdude** for the prior open-source work that helped inform this implementation.

## License & Usage

This project is released under the **MIT License**.

You may use, copy, modify, merge, publish, distribute, sublicense, and sell copies of this software, including for commercial use, as long as the original copyright notice and license text are preserved.

Please note:

- the software is provided **"AS IS"**, without warranty of any kind
- you must retain the license and copyright notice in copies or substantial portions of the software
- usage of the **Finnhub API** remains subject to Finnhub's own terms of service, rate limits, and data licensing restrictions

See the full text in [LICENSE](LICENSE).

## Support

- Issues: https://github.com/jackdark425/aigroup-finnhub-mcp/issues
- Repository: https://github.com/jackdark425/aigroup-finnhub-mcp
