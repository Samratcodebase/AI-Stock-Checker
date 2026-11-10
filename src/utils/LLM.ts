import type OpenAI from "openai";
import { get_stock_price_Schema } from "../utils/Tool_Schema";
import { selectProvider } from "../utils/Provider";
import { buildClient } from "../utils/Client_Builder";

const provider = selectProvider();
const client = buildClient(provider);
console.log(`Initialized ${provider.name} client`);

export async function LLM(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
) {
  const result = await client.chat.completions.create({
    model: provider.model,
    max_tokens: 200,
    messages,
    tools: [get_stock_price_Schema],
  });

  return result.choices[0];
}
