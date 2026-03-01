/**
 * Embedding module
 * Generates vector embeddings for business profiles using OpenAI.
 * Used both when seeding Pinecone and at query time for retrieval.
 */

import OpenAI from "openai";
import { formatBusinessForPrompt } from "@/lib/data/schema";
import type { BusinessProfile } from "@/lib/data/schema";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set. Add it to .env.local to enable RAG.");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Embed a single text string.
 */
export async function embedText(text: string): Promise<number[]> {
  const client = getOpenAIClient();
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

/**
 * Embed a business profile. Combines all searchable fields into
 * a single rich text document for maximum retrieval quality.
 */
export function buildBusinessDocument(business: BusinessProfile): string {
  const parts = [
    `Business: ${business.name}`,
    `Category: ${business.category}${business.subcategory ? ` — ${business.subcategory}` : ""}`,
    `Zone: ${business.zone}`,
    `Description: ${business.description}`,
    `Top items: ${business.topItems.join(", ")}`,
    `Price: ${business.priceTier}`,
    ...(business.hours ? [`Hours: ${business.hours}`] : []),
    ...(business.dietary ? [`Dietary options: ${business.dietary}`] : []),
    ...(business.flags.length > 0 ? [`Tags: ${business.flags.join(", ")}`] : []),
    ...(business.insiderTips && business.insiderTips.length > 0
      ? [`Insider tips: ${business.insiderTips.join(". ")}`]
      : []),
    ...(business.ownerStory ? [`Story: ${business.ownerStory}`] : []),
  ];
  return parts.join("\n");
}

/**
 * Embed a business profile for Pinecone indexing.
 */
export async function embedBusiness(
  business: BusinessProfile
): Promise<{ id: string; values: number[]; metadata: Record<string, string> }> {
  const document = buildBusinessDocument(business);
  const values = await embedText(document);

  return {
    id: business.id,
    values,
    metadata: {
      id: business.id,
      name: business.name,
      category: business.category,
      zone: business.zone,
      priceTier: business.priceTier,
      flags: business.flags.join(","),
      // Store the full formatted prompt text so we can use it directly
      promptText: formatBusinessForPrompt(business),
    },
  };
}

export { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS };
