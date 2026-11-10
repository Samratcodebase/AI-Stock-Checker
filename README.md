# AI Stock Checker

AI Stock Checker is a lightweight TypeScript project that uses a language model to answer stock-related questions by calling a tool that fetches real daily closing prices from Alpha Vantage.

The app is intentionally simple:

- an LLM generates a response and may call a `getStockPrice` function
- the function calls the Alpha Vantage API for the latest daily close
- the model then answers the user with the fetched price data

This makes the project a practical example of tool-calling with an LLM in a Node.js environment.

## What it does

The current entry point in `src/Main.ts` runs a fixed prompt:

- `Compare Canva and Microsoft`

The assistant uses the configured LLM provider and tool schema to decide whether it needs a stock lookup. If a stock symbol is required, it calls the stock price tool and uses the returned data in its final response.

## Project structure

- `src/Main.ts` — application entry point; initializes the chat loop and invokes the model
- `src/utils/Provider.ts` — provider selection logic for OpenAI, Groq, or OpenRouter
- `src/utils/Client_Builder.ts` — builds the OpenAI-compatible client for the selected provider
- `src/utils/LLM.ts` — sends chat messages and tool definitions to the model
- `src/utils/Tool_Schema.ts` — defines the `getStockPrice` function and its schema
- `src/utils/SystemPrompt.js` — instructions that tell the model how to use the stock tool
- `example.env` — template for environment variables

## Supported providers

The app supports these LLM providers, selected by whichever API key is present in the environment:

- OpenAI
- Groq
- OpenRouter

The logic in `src/utils/Provider.ts` checks environment variables in order and throws an error if none are configured.

## Environment variables

Create a `.env` file using the values in `example.env`:

```env
OPENAI_API_KEY=your_openai_api_key
# GROQ_API_KEY=your_groq_api_key
# OPENROUTER_API_KEY=your_openrouter_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

Notes:

- At least one LLM provider key is required.
- `ALPHA_VANTAGE_API_KEY` is required for stock price lookup.
- If multiple provider keys are set, OpenAI is selected first.

## Installation

```bash
npm install
```

## Run the app

```bash
npm run dev
```

This uses `tsx watch src/Main.ts` and starts the app in watch mode.

## Important behavior in the current code

Some details are worth noting because they affect how the app behaves today:

- The query is hardcoded in `src/Main.ts`; there is no CLI argument parser.
- The tool supports only the function named `getStockPrice`.
- The code loops until the model stops invoking tools, then prints the final message.
- The model is instructed to never guess a stock price if the data source can't provide one.
- The app uses Alpha Vantage's daily time series and returns the latest available closing price.

## Example output

The project is designed to produce responses like:

> AAPL closed at 210.50 on 2026-11-09.

or

> I couldn't find the latest daily closing price for MSFT.

## Dependencies

Main dependencies include:

- `openai` — for LLM API access
- `dotenv` — for loading environment variables
- `axios` — for Alpha Vantage requests
- `tsx` — for running TypeScript files in development
- `typescript` — TypeScript compiler

## Notes

This project is a small example and does not yet include:

- automated tests
- CLI input handling
- a production-ready app framework
- advanced caching or rate limiting

It is best viewed as a foundation for building a stock-query assistant around tool calling.
