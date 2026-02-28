"use client";

import { motion } from "framer-motion";

const suggestedActions = [
  "Where should I eat near the Pier?",
  "Where can I park downtown?",
  "What's happening this weekend?",
  "Best coffee shops to work from?",
];

export function SuggestedActions({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-testid="suggested-actions">
      {suggestedActions.map((action, index) => (
        <motion.button
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-foreground text-sm transition-colors hover:bg-muted min-h-[44px]"
          exit={{ opacity: 0, y: 10 }}
          initial={{ opacity: 0, y: 10 }}
          key={action}
          onClick={() => onSend(action)}
          transition={{ delay: 0.05 * index }}
          type="button"
        >
          {action}
        </motion.button>
      ))}
    </div>
  );
}
