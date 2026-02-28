"use client";

import { motion } from "framer-motion";

const chips = [
  { label: "Weekend trip", message: "I'm here for a weekend trip." },
  { label: "Day visit", message: "Just visiting for the day." },
  { label: "Traveling with kids", message: "I'm traveling with kids." },
  {
    label: "Local looking for tips",
    message: "I actually live here — looking for some local tips.",
  },
];

export function ContextChips({ onSend }: { onSend: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-muted-foreground text-xs">Quick context (optional):</p>
      <div className="flex flex-wrap justify-center gap-2">
        {chips.map(({ label, message }, index) => (
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full border border-border bg-background px-4 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground min-h-[44px]"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: 10 }}
            key={label}
            onClick={() => onSend(message)}
            transition={{ delay: 0.4 + 0.05 * index }}
            type="button"
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
