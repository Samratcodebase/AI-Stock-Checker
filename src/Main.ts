import "dotenv/config";
import type OpenAI from "openai";
import { LLM } from "./utils/LLM";
import { systemPrompt } from "./utils/SystemPrompt";
import { getStockPrice } from "./utils/Tool_Schema";

type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type StockPriceArguments = { stock_symbol: string };

const main = async (prompt: string): Promise<void> => {
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  while (true) {
    const result = await LLM(messages);
    const toolCalls = result.message.tool_calls;

    if (toolCalls?.length) {
      messages.push(result.message);
      console.log("Tool Call Needed");

      for (const toolCall of toolCalls) {
        let toolResult: unknown;

        if (toolCall.type !== "function") {
          toolResult = { error: "Unsupported tool type" };
        } else if (toolCall.function.name !== "getStockPrice") {
          toolResult = { error: `Unknown tool: ${toolCall.function.name}` };
        } else {
          const args = JSON.parse(
            toolCall.function.arguments,
          ) as StockPriceArguments;
          console.log("Making Tool Call");

          toolResult = await getStockPrice(args.stock_symbol);
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      continue;
    }

    if (result.message.content) {
      console.log(result.message.content);
    }
    return;
  }
};

const prompt = "Compare Canva and Microsoft";
main(prompt).catch((error: unknown) => {
  console.error("Stock checker failed:", error);
  process.exitCode = 1;
});
