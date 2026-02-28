import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic();

export function getLanguageModel(modelId: string) {
  return anthropic(modelId);
}
