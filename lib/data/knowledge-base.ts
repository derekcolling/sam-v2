import { businesses } from "./businesses";
import { formatBusinessForPrompt } from "./schema";
import type { BusinessProfile } from "./schema";

/**
 * Knowledge Base — the bridge between structured business data and
 * what gets injected into Sam's system prompt.
 *
 * Today: loads all active businesses and formats them for the prompt.
 * Tomorrow (Phase 2): this becomes the RAG retrieval layer —
 *   embed the user query → search Pinecone → return top-K matches.
 *
 * The rest of the system never knows the difference.
 */

/**
 * Get all active businesses, formatted for the system prompt.
 * This is the current "retrieve everything" approach. When RAG is wired up,
 * this function will be replaced with semantic search.
 */
export function getBusinessDirectory(): string {
    const active = businesses.filter((b) => b.active);
    return active.map(formatBusinessForPrompt).join("\n\n");
}

/**
 * Search businesses by simple text match.
 * Temporary bridge until Pinecone vector search is wired up.
 */
export function searchBusinesses(query: string): BusinessProfile[] {
    const q = query.toLowerCase();
    return businesses.filter((b) => {
        if (!b.active) return false;
        const searchable = [
            b.name,
            b.description,
            b.subcategory || "",
            b.category,
            ...b.topItems,
            ...b.flags,
            ...(b.insiderTips || []),
            b.zone,
        ]
            .join(" ")
            .toLowerCase();
        return searchable.includes(q);
    });
}

/**
 * Get businesses by zone.
 */
export function getBusinessesByZone(zone: string): BusinessProfile[] {
    return businesses.filter((b) => b.active && b.zone === zone);
}

/**
 * Get businesses by flag.
 */
export function getBusinessesByFlag(flag: string): BusinessProfile[] {
    return businesses.filter(
        (b) => b.active && b.flags.includes(flag as BusinessProfile["flags"][number])
    );
}

/**
 * Get a specific business by ID.
 */
export function getBusinessById(id: string): BusinessProfile | undefined {
    return businesses.find((b) => b.id === id);
}

/**
 * Stats for monitoring.
 */
export function getKnowledgeBaseStats() {
    const active = businesses.filter((b) => b.active);
    return {
        totalBusinesses: businesses.length,
        activeBusinesses: active.length,
        withInterviews: active.filter((b) => b.dataSource === "phone-interview").length,
        withInsiderTips: active.filter((b) => b.insiderTips && b.insiderTips.length > 0).length,
        byCategory: Object.entries(
            active.reduce(
                (acc, b) => {
                    acc[b.category] = (acc[b.category] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            )
        ),
        byZone: Object.entries(
            active.reduce(
                (acc, b) => {
                    acc[b.zone] = (acc[b.zone] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            )
        ),
    };
}
