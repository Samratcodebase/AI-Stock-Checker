import OpenAI from "openai";

import { type ProviderT } from "./Provider.js";

export function buildClient(provider: ProviderT) {
  const apiKey = process.env[provider.envVar];

  if (!provider.baseURL) {
    return new OpenAI({
      apiKey: apiKey,
    });
  }

  return new OpenAI({
    apiKey: apiKey,
    baseURL: provider.baseURL,
  });
}
