import { z } from "zod";

// ── Experience flags ──
export const experienceFlagSchema = z.enum([
  "date-night",
  "family-friendly",
  "good-for-groups",
  "dog-friendly",
  "instagram-worthy",
  "notable-view",
  "quick-meal",
  "laptops-welcome",
  "outdoor-seating",
  "local-independent",
  "santa-monica-original",
  "late-night",
  "world-cup-venue",
]);

export type ExperienceFlag = z.infer<typeof experienceFlagSchema>;

// ── Price tier ──
export const priceTierSchema = z.enum(["$", "$$", "$$$", "$$$$"]);
export type PriceTier = z.infer<typeof priceTierSchema>;

// ── Business category ──
export const businessCategorySchema = z.enum([
  "restaurant",
  "cafe",
  "bar-nightlife",
  "retail",
  "retail-specialty",
  "deli-market",
  "dessert",
  "outdoor-gear",
]);

export type BusinessCategory = z.infer<typeof businessCategorySchema>;

// ── Zone within DTSM ──
export const dtsmZoneSchema = z.enum([
  "ocean-avenue",
  "promenade",
  "bayside",
  "downtown-east",
  "main-street",
  "santa-monica-place",
]);

export type DtsmZone = z.infer<typeof dtsmZoneSchema>;

// ── Business profile ──
export const businessProfileSchema = z.object({
  // Identity
  id: z.string().describe("Unique slug, e.g. 'the-lobster'"),
  name: z.string().describe("Display name"),
  category: businessCategorySchema,
  subcategory: z.string().optional().describe("e.g. 'Seafood / California Coastal'"),

  // Location
  address: z.string(),
  crossStreets: z.string().optional(),
  zone: dtsmZoneSchema,
  phone: z.string().optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),

  // Hours
  hours: z.string().describe("Human-readable hours summary"),

  // What they offer
  description: z.string().describe("1-2 sentence insider description, conversational tone"),
  topItems: z.array(z.string()).describe("Top 3 recommended items"),
  priceTier: priceTierSchema,

  // Dietary & language
  dietary: z.string().optional().describe("e.g. 'GF yes, limited vegan'"),
  languages: z.array(z.string()).optional(),

  // Logistics
  reservations: z.string().optional().describe("e.g. 'Yes (OpenTable)', 'Walk-in only'"),
  parking: z.string().optional(),
  takeout: z.boolean().optional(),

  // Experience
  flags: z.array(experienceFlagSchema).default([]),

  // Insider knowledge (from interviews — the core differentiator)
  insiderTips: z.array(z.string()).optional().describe("Off-menu items, chef stories, local secrets"),
  ownerStory: z.string().optional().describe("First-person narrative from interview"),

  // Metadata
  dataSource: z.enum(["web-research", "phone-interview", "in-person"]).default("web-research"),
  lastUpdated: z.string().describe("ISO date of last data refresh"),
  active: z.boolean().default(true),
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;

/**
 * Format a business profile into the concise prompt format Sam uses
 * in recommendations. This is what gets injected into the system prompt.
 */
export function formatBusinessForPrompt(b: BusinessProfile): string {
  const lines: string[] = [];

  lines.push(`### ${b.name} (${b.subcategory || b.category})`);
  lines.push(`- Address: ${b.address}${b.crossStreets ? ` (${b.crossStreets})` : ""}`);
  lines.push(`- Zone: ${b.zone.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);

  if (b.phone) lines.push(`- Phone: ${b.phone}`);
  if (b.website) lines.push(`- Website: ${b.website}`);
  if (b.instagram) lines.push(`- Instagram: ${b.instagram}`);

  lines.push(`- Hours: ${b.hours}`);
  lines.push(`- Description: ${b.description}`);
  lines.push(`- Top items: ${b.topItems.join(", ")}`);
  const priceLabel: Record<string, string> = {
    $: "budget-friendly",
    $$: "moderate",
    $$$: "upscale",
    $$$$: "splurge",
  };
  lines.push(`- Price: ${priceLabel[b.priceTier] || b.priceTier}`);

  if (b.dietary) lines.push(`- Dietary: ${b.dietary}`);
  if (b.reservations) lines.push(`- Reservations: ${b.reservations}`);
  if (b.parking) lines.push(`- Parking: ${b.parking}`);

  if (b.flags.length > 0) {
    const flagLabels = b.flags.map((f) =>
      f
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
    lines.push(`- Flags: ${flagLabels.join(", ")}`);
  }

  if (b.insiderTips && b.insiderTips.length > 0) {
    lines.push(`- Insider tips: ${b.insiderTips.join(" | ")}`);
  }

  if (b.ownerStory) {
    lines.push(`- Owner story: ${b.ownerStory}`);
  }

  return lines.join("\n");
}
