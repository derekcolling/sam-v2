# CLAUDE.md

**Sam v2** — Downtown Santa Monica's AI Local Guide. Production build.
Source lives in `sam-v2/`. All commands run from there.

---

## Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Dev server (localhost:3000)
pnpm build                # Production build
pnpm lint                 # Lint via Ultracite (Biome-based)
pnpm format               # Auto-fix lint/format issues
pnpm seed                 # Seed Pinecone with business embeddings
```

---

## Architecture

**Stack:** Next.js 16, Vercel AI SDK v6, Anthropic (claude-sonnet-4-6), OpenAI (embeddings), Pinecone (vector DB), Tailwind CSS v4, framer-motion

**RAG Pipeline:** Semantic retrieval for business profiles via Pinecone + OpenAI embeddings (`text-embedding-3-small`).

**Request flow:** User → `app/(chat)/page.tsx` → `<Chat />` → `useChat()` → `app/(chat)/api/chat/route.ts` → Anthropic API → streaming → client

**Key paths:**
- `app/(chat)/page.tsx` — renders `<Chat />`
- `app/(chat)/api/chat/route.ts` — POST endpoint (streaming, tools, no auth)
- `components/chat.tsx` — main orchestrator (`useChat` hook, session context state)
- `components/header.tsx` — sticky top bar (logo + new chat button)
- `components/messages.tsx` — scrollable message list (empty state / messages)
- `components/message.tsx` — individual message with tool card rendering
- `components/input.tsx` — sticky bottom input bar
- `components/greeting.tsx` — empty state welcome animation
- `components/suggested-actions.tsx` — starter prompt grid
- `components/context-chips.tsx` — quick context pills
- `components/weather.tsx` — weather card
- `components/parking-status.tsx` — parking card
- `components/beach-safety-card.tsx` — beach conditions card
- `components/events-calendar.tsx` — events list card
- `lib/ai/prompts.ts` — Sam's system prompt (context-aware, dynamic injection)
- `lib/ai/providers.ts` — `getLanguageModel()` using `@ai-sdk/anthropic`
- `lib/ai/tools/` — AI tools (getWeather, getParking, getBeachSafety, getEvents, updateTripContext, getBusinessRecommendations)
- `lib/data/` — RAG & Data Layer (`schema.ts`, `businesses.ts`, `rag.ts`, `embedder.ts`, `knowledge-base.ts`)
- `scripts/seed-pinecone.ts` — embedding + indexing pipeline

**Session Memory & Context:**
- `updateTripContext` tool persists visitor preferences/history in memory
- `useChat` body includes `sessionContext` which is injected into the system prompt
- RAG retrieval extracts relevant business context per user message
- Firestore integration planned for Phase 2 persistence

**PWA:**
- `public/manifest.json` — `display: standalone`, theme `#6BC4BB`
- Apple PWA meta tags in `app/layout.tsx`
- `viewport-fit=cover` for iPhone notch/home indicator

---

## Tool Development (Critical)

Every tool in `lib/ai/tools/` MUST follow these rules for Anthropic provider compatibility:

1. Use `inputSchema` (NOT `parameters`)
2. `inputSchema` MUST be `z.object({})` — even for no-parameter tools
3. Every field MUST have `.describe()`

```typescript
export const myTool = tool({
  description: "What the tool does",
  inputSchema: z.object({
    paramName: z.string().describe("What this parameter is for"),
  }),
  execute: async ({ paramName }) => { ... }
});
```

---

## Code Style

- Linter: Ultracite (wraps Biome) — config in `biome.jsonc`
- Indentation: 2 spaces
- Package manager: `pnpm 9.12.3` (enforced)
- Tailwind CSS v4 with PostCSS
- Excluded from linting: `components/ui/`, `lib/utils.ts`

---

## Environment Variables

Requires `.env.local`:
- `ANTHROPIC_API_KEY` — powers Claude chat model
- `OPENAI_API_KEY` — used for text embeddings (1024 dim)
- `PINECONE_API_KEY` — vector database access

---

## Common Pitfalls

- **Empty response bubble** — missing `ANTHROPIC_API_KEY` or malformed tool schema (check server logs for `AI_APICallError`)
- **Operation Not Permitted** — `.env.local` permissions on macOS (`chmod 644`)
- **Tool not rendering** — check `part.type` matches `tool-{toolName}` pattern in `message.tsx`
- **streamdown CSS** — must keep `@source "../node_modules/streamdown/dist/index.js"` in `globals.css` for markdown styles
