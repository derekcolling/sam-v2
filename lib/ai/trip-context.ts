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
