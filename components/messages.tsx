"use client";

import type { UIMessage } from "ai";
import type { Ref, RefObject } from "react";
import { ContextChips } from "./context-chips";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";
import { SuggestedActions } from "./suggested-actions";

export function Messages({
  messages,
  isEmpty,
  isLoading,
  messagesEndRef,
  onSend,
}: {
  messages: UIMessage[];
  isEmpty: boolean;
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onSend: (text: string) => void;
}) {
  return (
    <div className="-webkit-overflow-scrolling-touch flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4">
        {isEmpty ? (
          <>
            <Greeting />
            <SuggestedActions onSend={onSend} />
            <ContextChips onSend={onSend} />
          </>
        ) : (
          <>
            {messages.map((message) => (
              <PreviewMessage
                isLoading={isLoading}
                key={message.id}
                message={message}
              />
            ))}
            {isLoading &&
              messages.at(-1)?.role !== "assistant" && <ThinkingMessage />}
          </>
        )}
        <div ref={messagesEndRef as Ref<HTMLDivElement>} />
      </div>
    </div>
  );
}
