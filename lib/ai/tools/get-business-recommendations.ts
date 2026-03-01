import { tool } from "ai";
import { z } from "zod";
import {
  searchBusinesses,
  getBusinessesByFlag,
  getBusinessesByZone,
} from "@/lib/data/knowledge-base";
import type { BusinessProfile } from "@/lib/data/schema";

// Compact shape sent to the client for rendering
type BusinessMiniCard = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  description: string;
  address: string;
  crossStreets: string | null;
  zone: string;
  priceTier: string;
  topItems: string[];
  flags: string[];
  website: string | null;
  instagram: string | null;
  phone: string | null;
  insiderTip: string | null;
};

export type BusinessRecommendationsOutput = {
  heading: string;
  businesses: BusinessMiniCard[];
};

const priceLabel: Record<string, string> = {
  $: "budget-friendly",
  $$: "moderate",
  $$$: "upscale",
  $$$$: "splurge",
};

function toMiniCard(b: BusinessProfile): BusinessMiniCard {
  return {
    id: b.id,
    name: b.name,
    category: b.category,
    subcategory: b.subcategory ?? null,
    description: b.description,
    address: b.address,
    crossStreets: b.crossStreets ?? null,
    zone: b.zone,
    priceTier: priceLabel[b.priceTier] || b.priceTier,
    topItems: b.topItems,
    flags: b.flags,
    website: b.website ?? null,
    instagram: b.instagram ?? null,
    phone: b.phone ?? null,
    insiderTip: b.insiderTips?.[0] ?? null,
  };
}

export const getBusinessRecommendations = tool({
  description:
    "Search the Downtown Santa Monica business directory and return structured mini-cards for the visitor. Use when recommending restaurants, cafes, bars, shops, or other local businesses.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Natural language search query describing what the visitor wants (e.g. 'seafood near the pier', 'best coffee for working', 'date night italian')"
      ),
    heading: z
      .string()
      .describe(
        "Short heading for the card group (e.g. 'Seafood Spots', 'Date Night Picks', 'Coffee Shops')"
      ),
    category: z
      .enum([
        "restaurant",
        "cafe",
        "bar-nightlife",
        "retail",
        "retail-specialty",
        "deli-market",
        "dessert",
        "outdoor-gear",
      ])
      .optional()
      .describe("Optional category filter"),
    zone: z
      .enum([
        "ocean-avenue",
        "promenade",
        "bayside",
        "downtown-east",
        "main-street",
        "santa-monica-place",
      ])
      .optional()
      .describe("Optional zone filter"),
    flag: z
      .string()
      .optional()
      .describe(
        "Optional experience flag filter (e.g. 'date-night', 'dog-friendly', 'laptops-welcome')"
      ),
  }),
  execute: async ({ query, heading, category, zone, flag }) => {
    let results = searchBusinesses(query);

    if (category) {
      results = results.filter((b) => b.category === category);
    }
    if (zone) {
      const zoneResults = getBusinessesByZone(zone);
      const zoneIds = new Set(zoneResults.map((b) => b.id));
      results = results.filter((b) => zoneIds.has(b.id));
    }
    if (flag) {
      const flagResults = getBusinessesByFlag(flag);
      const flagIds = new Set(flagResults.map((b) => b.id));
      results = results.filter((b) => flagIds.has(b.id));
    }

    // Fallback: try flag-only or zone-only if text search returned nothing
    if (results.length === 0 && flag) {
      results = getBusinessesByFlag(flag);
    }
    if (results.length === 0 && zone) {
      results = getBusinessesByZone(zone);
    }
    // Last resort: try category-only
    if (results.length === 0 && category) {
      const { businesses } = await import("@/lib/data/businesses");
      results = businesses.filter(
        (b) => b.active && b.category === category
      );
    }

    const capped = results.slice(0, 3);

    return {
      heading,
      businesses: capped.map(toMiniCard),
    } satisfies BusinessRecommendationsOutput;
  },
});
