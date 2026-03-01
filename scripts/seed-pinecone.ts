/**
 * seed-pinecone.ts
 *
 * One-time (and re-runnable) script to embed all active business profiles
 * and upsert them into Pinecone for RAG retrieval.
 *
 * Usage:
 *   pnpm seed
 *
 * Requirements:
 *   PINECONE_API_KEY and OPENAI_API_KEY must be set in .env.local
 *
 * Safe to re-run — Pinecone upsert is idempotent.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { Pinecone } from "@pinecone-database/pinecone";
import { businesses } from "../lib/data/businesses";
import { embedBusiness, EMBEDDING_DIMENSIONS } from "../lib/data/embedder";

const PINECONE_INDEX_NAME = "sam-chat";

async function seed() {
    const pineconeApiKey = process.env.PINECONE_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!pineconeApiKey) {
        console.error("❌ PINECONE_API_KEY is not set in .env.local");
        process.exit(1);
    }
    if (!openaiApiKey) {
        console.error("❌ OPENAI_API_KEY is not set in .env.local");
        process.exit(1);
    }

    console.log("🚀 Starting Pinecone seed...\n");

    const pinecone = new Pinecone({ apiKey: pineconeApiKey });

    // ── Create index if it doesn't exist ──
    const existingIndexes = await pinecone.listIndexes();
    const indexNames = existingIndexes.indexes?.map((i) => i.name) ?? [];

    if (!indexNames.includes(PINECONE_INDEX_NAME)) {
        console.log(`📦 Creating index "${PINECONE_INDEX_NAME}"...`);
        await pinecone.createIndex({
            name: PINECONE_INDEX_NAME,
            dimension: EMBEDDING_DIMENSIONS,
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: "aws",
                    region: "us-east-1",
                },
            },
        });
        // Wait for index to be ready
        console.log("⏳ Waiting for index to be ready...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
    } else {
        console.log(`✅ Index "${PINECONE_INDEX_NAME}" already exists\n`);
    }

    const index = pinecone.index(PINECONE_INDEX_NAME).namespace("sam-v2");
    const active = businesses.filter((b) => b.active);

    console.log(`📝 Embedding ${active.length} businesses...\n`);

    const vectors = [];
    for (const business of active) {
        process.stdout.write(`  Embedding: ${business.name}...`);
        try {
            const vector = await embedBusiness(business);
            vectors.push(vector);
            console.log(" ✓");
        } catch (err) {
            console.log(` ✗ (${err})`);
        }
    }

    console.log(`\n⬆️  Upserting ${vectors.length} vectors to Pinecone...`);
    // Upsert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await index.upsert(batch);
    }

    console.log(`\n✅ Done! ${vectors.length} businesses indexed in Pinecone.`);
    console.log(`   Index: ${PINECONE_INDEX_NAME}`);
    console.log(`   Dimensions: ${EMBEDDING_DIMENSIONS}`);
    console.log(`   Model: text-embedding-3-small`);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
