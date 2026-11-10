declare const process: { env: Record<string, string | undefined> };
export type ProviderT = {
  name: string;
  envVar: string;
  isFree: boolean;
  baseURL: null | string;
  model: string;
};
const Provider = [
  {
    name: "OpenAI",
    envVar: "OPENAI_API_KEY",
    isFree: false,
    baseURL: null,
    model: "gpt-4o-mini",
  },

  {
    name: "Groq",
    envVar: "GROQ_API_KEY",
    isFree: true,
    baseURL: "https://api.groq.com/openai/v1",
    model: "openai/gpt-oss-120b",
  },
  {
    name: "OpenRouter",
    envVar: "OPENROUTER_API_KEY",
    isFree: false,
    baseURL: "https://openrouter.ai/api/v1",
    model: "openai/gpt-4o-mini",
  },
];

export const selectProvider = () => {
  for (let provider of Provider) {
    if (process.env[provider.envVar]) {
      console.log("Found a Provider key");

      return provider;
    }
  }

  const Expected = Provider.map((provider) => provider.name).join(",");
  console.log("No Proivder key Found");

  throw new Error(`No Provider Key Found , Add one of :${Expected}`);
};
