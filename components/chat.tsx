"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { ChatHeader } from "./header";
import { ChatInput } from "./input";
import { Messages } from "./messages";

export function Chat() {
  const [sessionContext, setSessionContext] = useState<string>("");
  const sessionContextRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync so the transport closure always reads the latest value
  useEffect(() => {
    sessionContextRef.current = sessionContext;
  }, [sessionContext]);

  const transport = useRef(
    new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ sessionContext: sessionContextRef.current }),
    })
  );

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
  } = useChat({
    transport: transport.current,
    onFinish: ({ messages: finishedMessages }) => {
      // Extract any saved profile content from saveUserProfile tool results
      for (const msg of finishedMessages) {
        for (const part of msg.parts) {
          if (
            part.type === "tool-saveUserProfile" &&
            part.state === "output-available" &&
            part.output &&
            "savedContent" in (part.output as Record<string, unknown>)
          ) {
            const saved = (part.output as Record<string, unknown>).savedContent as string;
            setSessionContext((prev) =>
              prev ? `${prev}\n- ${saved}` : `- ${saved}`
            );
          }
        }
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setSessionContext("");
  }, [setMessages]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text }],
      });
    },
    [sendMessage]
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-dvh flex-col bg-background overscroll-none">
      <ChatHeader onNewChat={handleNewChat} />

      <Messages
        isEmpty={isEmpty}
        isLoading={isLoading}
        messages={messages as UIMessage[]}
        messagesEndRef={messagesEndRef}
        onSend={handleSend}
      />

      <ChatInput
        isLoading={isLoading}
        onSend={handleSend}
        onStop={stop}
      />
    </div>
  );
}
