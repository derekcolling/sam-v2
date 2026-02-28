"use client";

import { SquarePen } from "lucide-react";

export function ChatHeader({ onNewChat }: { onNewChat: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Downtown Santa Monica"
          className="size-8 rounded-full shadow-sm"
          src="/images/dtsm-logo-circle.jpeg"
        />
        <span className="font-semibold text-foreground text-sm">Ask Sam</span>
      </div>

      <button
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground min-h-[44px]"
        onClick={onNewChat}
        type="button"
      >
        <SquarePen className="size-4" />
        <span>New chat</span>
      </button>
    </header>
  );
}
