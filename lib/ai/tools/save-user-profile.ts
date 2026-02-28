import { tool } from "ai";
import { z } from "zod";

export const saveUserProfile = tool({
  description:
    "Save a visitor preference, trip detail, or context to personalize recommendations for this session.",
  inputSchema: z.object({
    content: z
      .string()
      .describe(
        "The specific detail to remember (e.g., 'Loves seafood', 'Leaving on Tuesday', 'Here with two kids'). Keep it concise."
      ),
  }),
  execute: async ({ content }) => {
    return {
      status: "success",
      savedContent: content,
    };
  },
});
