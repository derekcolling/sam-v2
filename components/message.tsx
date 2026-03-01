"use client";

import type { UIMessage } from "ai";
import cx from "classnames";
import { Streamdown } from "streamdown";
import { BeachSafetyCard } from "./beach-safety-card";
import { BusinessRecommendations } from "./business-recommendations";
import { EventsCalendar } from "./events-calendar";
import { ParkingStatus } from "./parking-status";
import { Weather } from "./weather";

export function PreviewMessage({
  message,
  isLoading,
}: {
  message: UIMessage;
  isLoading: boolean;
}) {
  return (
    <div
      className="fade-in w-full animate-in duration-200"
      data-role={message.role}
    >
      <div
        className={cx("flex w-full items-start gap-2", {
          "justify-end": message.role === "user",
          "justify-start": message.role === "assistant",
        })}
      >
        {message.role === "assistant" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt="Sam"
            className="-mt-1 size-8 shrink-0 rounded-full"
            src="/images/dtsm-logo-circle.jpeg"
          />
        )}

        <div
          className={cx("flex flex-col gap-2", {
            "w-full": message.role === "assistant",
            "max-w-[min(80%,calc(100%-2.5rem))]": message.role === "user",
          })}
        >
          {message.parts?.map((part, index) => {
            const key = `${message.id}-${index}`;

            if (part.type === "text") {
              if (message.role === "user") {
                return (
                  <div
                    className="rounded-2xl bg-primary px-3 py-2 font-bold text-sm text-white"
                    key={key}
                  >
                    {part.text}
                  </div>
                );
              }
              return (
                <Streamdown
                  className="size-full text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:whitespace-pre-wrap [&_code]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto"
                  key={key}
                >
                  {part.text}
                </Streamdown>
              );
            }

            if (part.type === "tool-getWeather") {
              const widthClass = "w-[min(100%,450px)]";
              if (part.state === "output-available") {
                return (
                  <div className={widthClass} key={part.toolCallId}>
                    <Weather weatherAtLocation={part.output as never} />
                  </div>
                );
              }
              return (
                <div className={widthClass} key={part.toolCallId}>
                  <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
                    <span className="animate-pulse">Checking weather...</span>
                  </div>
                </div>
              );
            }

            if (part.type === "tool-getParking") {
              const widthClass = "w-[min(100%,450px)]";
              if (part.state === "output-available") {
                return (
                  <div className={widthClass} key={part.toolCallId}>
                    <ParkingStatus parkingData={part.output as never} />
                  </div>
                );
              }
              return (
                <div className={widthClass} key={part.toolCallId}>
                  <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
                    <span className="animate-pulse">
                      Checking parking availability...
                    </span>
                  </div>
                </div>
              );
            }

            if (part.type === "tool-getBeachSafety") {
              const widthClass = "w-[min(100%,450px)]";
              if (part.state === "output-available") {
                return (
                  <div className={widthClass} key={part.toolCallId}>
                    <BeachSafetyCard beachData={part.output as never} />
                  </div>
                );
              }
              return (
                <div className={widthClass} key={part.toolCallId}>
                  <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
                    <span className="animate-pulse">
                      Checking beach conditions...
                    </span>
                  </div>
                </div>
              );
            }

            if (part.type === "tool-getEvents") {
              const widthClass = "w-[min(100%,450px)]";
              if (part.state === "output-available") {
                return (
                  <div className={widthClass} key={part.toolCallId}>
                    <EventsCalendar events={part.output as never} />
                  </div>
                );
              }
              return (
                <div className={widthClass} key={part.toolCallId}>
                  <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
                    <span className="animate-pulse">
                      Checking local events...
                    </span>
                  </div>
                </div>
              );
            }

            if (part.type === "tool-getBusinessRecommendations") {
              const widthClass = "w-[min(100%,450px)]";
              if (part.state === "output-available") {
                return (
                  <div className={widthClass} key={part.toolCallId}>
                    <BusinessRecommendations
                      data={part.output as never}
                    />
                  </div>
                );
              }
              return (
                <div className={widthClass} key={part.toolCallId}>
                  <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
                    <span className="animate-pulse">
                      Finding the best spots...
                    </span>
                  </div>
                </div>
              );
            }

            // updateTripContext renders nothing visible
            if (part.type === "tool-updateTripContext") {
              return null;
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export function ThinkingMessage() {
  return (
    <div
      className="fade-in w-full animate-in duration-300"
      data-role="assistant"
    >
      <div className="flex items-start justify-start gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Sam"
          className="-mt-1 size-8 shrink-0 animate-pulse rounded-full"
          src="/images/dtsm-logo-circle.jpeg"
        />
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <span className="animate-pulse">Thinking</span>
          <span className="inline-flex">
            <span className="animate-bounce [animation-delay:0ms]">.</span>
            <span className="animate-bounce [animation-delay:150ms]">.</span>
            <span className="animate-bounce [animation-delay:300ms]">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
