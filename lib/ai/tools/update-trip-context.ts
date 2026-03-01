import { tool } from "ai";
import { z } from "zod";

export const updateTripContext = tool({
  description:
    "Update the visitor's trip context when you learn new details from conversation. Call with only the fields you've learned — omit unknown fields. For array fields (cuisinePreferences, interests, notes, etc.), send only NEW items to add, not the full list. This tool is invisible to the visitor.",
  inputSchema: z.object({
    tripType: z
      .enum(["vacation", "business", "day-trip", "weekend", "local"])
      .optional()
      .describe("The type of trip the visitor is on"),
    arrivalDate: z
      .string()
      .optional()
      .describe("Arrival date in ISO format (YYYY-MM-DD)"),
    departureDate: z
      .string()
      .optional()
      .describe("Departure date in ISO format (YYYY-MM-DD)"),
    stayingAt: z
      .string()
      .optional()
      .describe("Hotel or accommodation name"),
    stayingZone: z
      .enum([
        "ocean-avenue",
        "promenade",
        "bayside",
        "downtown-east",
        "main-street",
        "santa-monica-place",
      ])
      .optional()
      .describe("The DTSM zone closest to where the visitor is staying"),
    hasVehicle: z
      .boolean()
      .optional()
      .describe("Whether the visitor has a car"),
    groupType: z
      .enum(["solo", "couple", "family", "friends", "business-group"])
      .optional()
      .describe("The composition of the visitor's group"),
    groupSize: z
      .number()
      .optional()
      .describe("Total number of people in the group"),
    kidAges: z
      .array(z.number())
      .optional()
      .describe("Ages of children in the group, if any"),
    hasDog: z
      .boolean()
      .optional()
      .describe("Whether the visitor has a dog with them"),
    cuisinePreferences: z
      .array(z.string())
      .optional()
      .describe(
        "NEW cuisine preferences to add (e.g. 'seafood', 'italian'). Only send items not already known.",
      ),
    dietaryRestrictions: z
      .array(z.string())
      .optional()
      .describe(
        "NEW dietary restrictions to add (e.g. 'vegetarian', 'gluten-free'). Only send items not already known.",
      ),
    budgetSignal: z
      .enum(["budget-friendly", "moderate", "upscale", "splurge-worthy"])
      .optional()
      .describe(
        "Inferred budget level. Never ask the visitor directly — infer from hotel, price reactions, and cues.",
      ),
    interests: z
      .array(z.string())
      .optional()
      .describe(
        "NEW interests or activities to add (e.g. 'surfing', 'shopping', 'art'). Only send items not already known.",
      ),
    pace: z
      .enum(["relaxed", "packed", "flexible"])
      .optional()
      .describe("How packed the visitor wants their schedule to be"),
    notes: z
      .array(z.string())
      .optional()
      .describe(
        "NEW free-form observations (e.g. 'Loved the sunset at the pier', 'Celebrating anniversary'). Only send new notes.",
      ),
    visitedBusinessIds: z
      .array(z.string())
      .optional()
      .describe(
        "Business IDs of places the visitor mentions having already visited",
      ),
    recommendedBusinessIds: z
      .array(z.string())
      .optional()
      .describe(
        "Business IDs of places you just recommended (for anti-repetition tracking)",
      ),
  }),
  execute: async (input) => {
    return {
      status: "updated",
      updates: input,
    };
  },
});
