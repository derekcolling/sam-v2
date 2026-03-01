"use client";

import { MapPin, Navigation, Globe, Sparkles } from "lucide-react";
import type { BusinessRecommendationsOutput } from "@/lib/ai/tools/get-business-recommendations";

const categoryEmoji: Record<string, string> = {
  restaurant: "\u{1F37D}\u{FE0F}",
  cafe: "\u2615",
  "bar-nightlife": "\u{1F378}",
  retail: "\u{1F6CD}\u{FE0F}",
  "retail-specialty": "\u{1F6CD}\u{FE0F}",
  "deli-market": "\u{1F956}",
  dessert: "\u{1F366}",
  "outdoor-gear": "\u{1F3D5}\u{FE0F}",
};

const priceColors: Record<string, string> = {
  "budget-friendly": "text-emerald-600 bg-emerald-500/10",
  moderate: "text-blue-600 bg-blue-500/10",
  upscale: "text-violet-600 bg-violet-500/10",
  splurge: "text-amber-600 bg-amber-500/10",
};

function formatFlag(flag: string): string {
  return flag
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCategory(cat: string, sub: string | null): string {
  if (sub) {
    return sub.split(/\s*[\/\u2014]\s*/)[0];
  }
  return cat
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BusinessRecommendations({
  data,
}: {
  data: BusinessRecommendationsOutput;
}) {
  if (!data?.businesses || data.businesses.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
        No matching businesses found. Try asking differently!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-1 pb-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">
          {data.heading}
        </h3>
      </div>

      {/* Business rows */}
      {data.businesses.map((biz) => {
        const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${biz.name} ${biz.address} Santa Monica CA`)}`;
        const displayFlags = biz.flags.slice(0, 2);

        return (
          <div
            key={biz.id}
            className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-3"
          >
            {/* Row 1: Name + category pill + price badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base leading-none">
                {categoryEmoji[biz.category] || "\u{1F4CD}"}
              </span>
              <h4 className="font-semibold text-sm text-foreground leading-tight">
                {biz.name}
              </h4>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {formatCategory(biz.category, biz.subcategory)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${priceColors[biz.priceTier] || "text-muted-foreground bg-muted"}`}
              >
                {biz.priceTier}
              </span>
            </div>

            {/* Row 2: Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {biz.description}
            </p>

            {/* Row 3: Flags (max 2) */}
            {displayFlags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {displayFlags.map((flag) => (
                  <span
                    key={flag}
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {formatFlag(flag)}
                  </span>
                ))}
              </div>
            )}

            {/* Row 4: Address + action links */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-0">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{biz.address}</span>
              </span>
              <div className="flex items-center gap-3 shrink-0">
                {biz.website && (
                  <a
                    href={
                      biz.website.startsWith("http")
                        ? biz.website
                        : `https://${biz.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 font-medium"
                  >
                    <Globe className="h-3 w-3" />
                    Website
                  </a>
                )}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 font-medium"
                >
                  <Navigation className="h-3 w-3" />
                  Directions
                </a>
              </div>
            </div>

            {/* Insider tip (if available) */}
            {biz.insiderTip && (
              <div className="mt-0.5 rounded bg-accent/50 px-2 py-1.5 text-[11px] text-accent-foreground italic">
                Tip: {biz.insiderTip}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
