"use client";

import { Calendar, Clock, MapPin, Music, Utensils, Activity, Palette, Users } from "lucide-react";
import type { CalendarEvent } from "@/lib/ai/tools/get-events";

type CategoryConfig = {
  icon: React.ReactNode;
  pill: string;
  border: string;
};

const categoryConfig: Record<string, CategoryConfig> = {
  Music:     { icon: <Music className="w-3.5 h-3.5" />,    pill: "text-violet-500 bg-violet-500/10", border: "border-l-violet-500" },
  Food:      { icon: <Utensils className="w-3.5 h-3.5" />, pill: "text-amber-500 bg-amber-500/10",   border: "border-l-amber-500" },
  Fitness:   { icon: <Activity className="w-3.5 h-3.5" />, pill: "text-emerald-500 bg-emerald-500/10", border: "border-l-emerald-500" },
  Art:       { icon: <Palette className="w-3.5 h-3.5" />,  pill: "text-pink-500 bg-pink-500/10",     border: "border-l-pink-500" },
  Community: { icon: <Users className="w-3.5 h-3.5" />,    pill: "text-sky-500 bg-sky-500/10",       border: "border-l-sky-500" },
};

const defaultConfig: CategoryConfig = {
  icon: <Calendar className="w-3.5 h-3.5" />,
  pill: "text-muted-foreground bg-muted",
  border: "border-l-border",
};

export function EventsCalendar({ events }: { events: CalendarEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Calendar className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-sm">No upcoming events found.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2.5">
      {events.map((event) => {
        const cfg = categoryConfig[event.category] ?? defaultConfig;
        return (
          <div
            key={event.id}
            className={`rounded-xl border border-border bg-card border-l-4 ${cfg.border} p-4 transition-colors hover:bg-muted/40`}
          >
            {/* Date + category row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {event.date}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.pill}`}>
                {cfg.icon}
                {event.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground leading-snug mb-1">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {event.description}
            </p>

            {/* Time + location */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {event.time}
              </span>
              <span className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
