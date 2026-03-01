import type { DtsmZone } from "@/lib/data/schema";

export type TripContext = {
  // ── Trip logistics ──
  tripType:
  | "vacation"
  | "business"
  | "day-trip"
  | "weekend"
  | "local"
  | null;
  arrivalDate: string | null;
  departureDate: string | null;
  stayingAt: string | null;
  stayingZone: DtsmZone | null;
  hasVehicle: boolean | null;

  // ── Group composition ──
  groupType:
  | "solo"
  | "couple"
  | "family"
  | "friends"
  | "business-group"
  | null;
  groupSize: number | null;
  kidAges: number[] | null;
  hasDog: boolean | null;

  // ── Preferences ──
  cuisinePreferences: string[];
  dietaryRestrictions: string[];
  budgetSignal:
  | "budget-friendly"
  | "moderate"
  | "upscale"
  | "splurge-worthy"
  | null;
  interests: string[];
  pace: "relaxed" | "packed" | "flexible" | null;

  // ── Learned context ──
  notes: string[];
  visitedBusinessIds: string[];
  recommendedBusinessIds: string[];
};

export function createEmptyTripContext(): TripContext {
  return {
    tripType: null,
    arrivalDate: null,
    departureDate: null,
    stayingAt: null,
    stayingZone: null,
    hasVehicle: null,
    groupType: null,
    groupSize: null,
    kidAges: null,
    hasDog: null,
    cuisinePreferences: [],
    dietaryRestrictions: [],
    budgetSignal: null,
    interests: [],
    pace: null,
    notes: [],
    visitedBusinessIds: [],
    recommendedBusinessIds: [],
  };
}

const APPEND_FIELDS = new Set<keyof TripContext>([
  "cuisinePreferences",
  "dietaryRestrictions",
  "interests",
  "notes",
  "visitedBusinessIds",
  "recommendedBusinessIds",
]);

export function mergeTripContextUpdate(
  current: TripContext,
  updates: Partial<TripContext>,
): TripContext {
  const merged = { ...current };

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null) continue;

    const field = key as keyof TripContext;

    if (APPEND_FIELDS.has(field)) {
      const existing = (current[field] as unknown[]) || [];
      const incoming = value as unknown[];
      (merged as Record<string, unknown>)[field] = [
        ...new Set([...existing, ...incoming]),
      ];
    } else {
      (merged as Record<string, unknown>)[field] = value;
    }
  }

  return merged;
}
export function formatTripContext(context: TripContext): string | null {
  const parts: string[] = [];

  if (context.tripType) parts.push(`- Trip type: ${context.tripType}`);
  if (context.arrivalDate) parts.push(`- Arrival: ${context.arrivalDate}`);
  if (context.departureDate) parts.push(`- Departure: ${context.departureDate}`);
  if (context.stayingAt) parts.push(`- Staying at: ${context.stayingAt}`);
  if (context.stayingZone) parts.push(`- Staying zone: ${context.stayingZone}`);
  if (context.hasVehicle !== null)
    parts.push(`- Has vehicle: ${context.hasVehicle ? "Yes" : "No"}`);

  if (context.groupType) parts.push(`- Group: ${context.groupType}`);
  if (context.groupSize) parts.push(`- Group size: ${context.groupSize}`);
  if (context.kidAges && context.kidAges.length > 0)
    parts.push(`- Kid ages: ${context.kidAges.join(", ")}`);
  if (context.hasDog !== null)
    parts.push(`- Traveling with dog: ${context.hasDog ? "Yes" : "No"}`);

  if (context.cuisinePreferences.length > 0)
    parts.push(`- Cuisine preferences: ${context.cuisinePreferences.join(", ")}`);
  if (context.dietaryRestrictions.length > 0)
    parts.push(`- Dietary restrictions: ${context.dietaryRestrictions.join(", ")}`);
  if (context.budgetSignal) parts.push(`- Budget: ${context.budgetSignal}`);
  if (context.interests.length > 0)
    parts.push(`- General interests: ${context.interests.join(", ")}`);
  if (context.pace) parts.push(`- Desired pace: ${context.pace}`);

  if (context.notes.length > 0) {
    parts.push("\nAdditional notes:");
    for (const note of context.notes) {
      parts.push(`- ${note}`);
    }
  }

  if (context.visitedBusinessIds.length > 0)
    parts.push(`- Known visited businesses: ${context.visitedBusinessIds.join(", ")}`);
  if (context.recommendedBusinessIds.length > 0)
    parts.push(`- Prior recommendations: ${context.recommendedBusinessIds.join(", ")}`);

  return parts.length > 0 ? parts.join("\n") : null;
}
