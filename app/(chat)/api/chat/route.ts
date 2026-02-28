import { geolocation } from "@vercel/functions";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { getBeachSafety } from "@/lib/ai/tools/get-beach-safety";
import { getEvents } from "@/lib/ai/tools/get-events";
import { getParking } from "@/lib/ai/tools/get-parking";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { saveUserProfile } from "@/lib/ai/tools/save-user-profile";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { messages, sessionContext } = await request.json();

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: getLanguageModel("claude-sonnet-4-6"),
      system: systemPrompt({ requestHints, sessionContext }),
      messages: modelMessages,
      stopWhen: stepCountIs(5),
      maxRetries: 3,
      tools: {
        getWeather,
        getParking,
        getBeachSafety,
        getEvents,
        saveUserProfile,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    const isOverloaded =
      error instanceof Error &&
      ("statusCode" in error || "status" in error) &&
      ((error as { statusCode?: number }).statusCode === 529 ||
        (error as { status?: number }).status === 529);

    if (isOverloaded) {
      return new Response(
        JSON.stringify({ error: "Sam is a little overwhelmed right now — try again in a moment." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
