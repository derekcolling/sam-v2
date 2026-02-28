"use client";

import { ArrowUp, Square } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export function ChatInput({
  isLoading,
  onSend,
  onStop,
}: {
  isLoading: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, []);

  const handleSubmit = useCallback(() => {
    const text = value.trim();
    if (!text || isLoading) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div
      className="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex w-full max-w-2xl items-end gap-2 px-3 py-3">
        <div className="flex min-h-[44px] flex-1 items-end rounded-2xl border border-border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
          <textarea
            className="max-h-40 min-h-[28px] flex-1 resize-none bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
            disabled={isLoading}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about restaurants, parking, events..."
            ref={textareaRef}
            rows={1}
            value={value}
          />
        </div>

        {isLoading ? (
          <button
            className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
            onClick={onStop}
            type="button"
          >
            <Square className="size-4 fill-current" />
          </button>
        ) : (
          <button
            className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
            disabled={!value.trim()}
            onClick={handleSubmit}
            type="button"
          >
            <ArrowUp className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
