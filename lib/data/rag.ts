/**
 * Pinecone RAG retrieval module.
 *
 * Handles:
 *   1. Connecting to Pinecone
 *   2. Querying by semantic similarity given a user message
 *   3. Returning formatted business profiles for prompt injection
 *
 * Today this is called at query time in /api/chat/route.ts.
 * When RAG is not available (missing keys), falls back to loading
 * all businesses from the local knowledge base.
 */

import { Pinecone } from "@pinecone-database/pinecone";
import { embedText } from "./embedder";
import { formatBusinessForPrompt } from "@/lib/data/schema";
import { getBusinessDirectory } from "./knowledge-base";

const PINECONE_INDEX_NAME = "sam-dtsm-businesses";
const TOP_K = 6; // how many businesses to retrieve per query

let pineconeClient: Pinecone | null = null;

function getPineconeClient(): Pinecone | null {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) return null;

    if (!pineconeClient) {
        pineconeClient = new Pinecone({ apiKey });
    }
    return pineconeClient;
}

/**
 * Returns true if RAG is configured and available.
 */
export function isRAGAvailable(): boolean {
    return !!(process.env.PINECONE_API_KEY && process.env.OPENAI_API_KEY);
}

/**
 * Retrieve the most relevant businesses for a user query.
 *
 * If RAG is available: embeds the query, searches Pinecone, returns
 * top-K business profiles formatted for the system prompt.
 *
 * If RAG is not available (missing keys or error): falls back to
 * returning all businesses from the local knowledge base.
 */
export async function retrieveBusinessContext(userQuery: string): Promise<string> {
    // Graceful fallback if RAG isn't configured yet
    if (!isRAGAvailable()) {
        return getBusinessDirectory();
    }

    try {
        const client = getPineconeClient();
        if (!client) return getBusinessDirectory();

        const index = client.index(PINECONE_INDEX_NAME);

        // Embed the user's query
        const queryVector = await embedText(userQuery);

        // Search Pinecone for similar business profiles
        const results = await index.query({
            vector: queryVector,
            topK: TOP_K,
            includeMetadata: true,
        });

        if (!results.matches || results.matches.length === 0) {
            return getBusinessDirectory();
        }

        // Extract pre-formatted prompt text from metadata
        const contextBlocks = results.matches
            .filter((m: { metadata?: Record<string, unknown> }) => m.metadata?.promptText)
            .map((m: { metadata?: Record<string, unknown> }) => m.metadata!.promptText as string);

        if (contextBlocks.length === 0) {
            return getBusinessDirectory();
        }

        return contextBlocks.join("\n\n");
    } catch (error) {
        // Never crash the chat on RAG failure — always fall back
        console.error("[RAG] Retrieval failed, falling back to full directory:", error);
        return getBusinessDirectory();
    }
}

/**
 * Retrieve businesses for a specific zone (used by wayfinding queries).
 */
export async function retrieveByZone(zone: string): Promise<string> {
    if (!isRAGAvailable()) {
        return getBusinessDirectory();
    }

    // Zone queries are simple — just use the zone name as the query
    return retrieveBusinessContext(`restaurants and things to do in ${zone} Santa Monica`);
}
