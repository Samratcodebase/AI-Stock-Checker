import type OpenAI from "openai";
import axios from "axios";

export const getStockPrice = async (stock_symbol: string) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ALPHA_VANTAGE_API_KEY environment variable");
  }

  const symbol = stock_symbol.trim().toUpperCase();
  const { data } = await axios.get<{
    "Time Series (Daily)"?: Record<string, { "4. close"?: string }>;
    "Error Message"?: string;
    Note?: string;
    Information?: string;
  }>("https://www.alphavantage.co/query", {
    params: {
      function: "TIME_SERIES_DAILY",
      symbol,
      apikey: apiKey,
    },
    headers: { "User-Agent": "AI-Stock-Checker" },
  });

  if (data["Error Message"] || data.Note || data.Information) {
    throw new Error(
      data["Error Message"] ?? data.Note ?? data.Information,
    );
  }

  const dailySeries = data["Time Series (Daily)"];
  const latestDate = dailySeries && Object.keys(dailySeries).sort().at(-1);
  const latestClose = latestDate && dailySeries?.[latestDate]?.["4. close"];

  if (!latestDate || !latestClose || !Number.isFinite(Number(latestClose))) {
    throw new Error(`No daily closing price returned for ${symbol}`);
  }

  return {
    stock_symbol: symbol,
    regularPrice: Number(latestClose),
    asOf: latestDate,
  };
};

export const get_stock_price_Schema = {
  type: "function",
  function: {
    name: "getStockPrice",
    description: "Get the latest daily closing price for a stock symbol.",

    parameters: {
      type: "object",
      properties: {
        stock_symbol: {
          type: "string",
          description: "The stock symbol to get the price for.",
        },
      },
      required: ["stock_symbol"],
    },
  },
} satisfies OpenAI.Chat.Completions.ChatCompletionTool;
