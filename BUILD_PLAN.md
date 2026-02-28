# Sam v2 — Build Plan

## What Exists Today

The [sam-bot/sam-chat](file:///Users/derekcolling/Documents/Antigravity/sam-bot/sam-chat) project is a **working prototype** that proves the core concept. Here's what's already shipped:

| Layer | Current State |
|---|---|
| **Framework** | Next.js 16 + Vercel AI SDK v6 + Tailwind v4 |
| **LLM** | Claude Sonnet 4 via `@ai-sdk/anthropic` |
| **Knowledge Base** | 18 businesses **hardcoded in the system prompt** (~4K tokens) |
| **Tools** | Weather, Parking availability, Beach safety/surf, Events calendar, User profile save |
| **Memory** | Session-only (React `useState`, clears on tab close) |
| **UI** | Chat + greeting animation + suggested actions + tool cards (weather, parking, beach, events) |
| **PWA** | `manifest.json`, iOS meta tags, standalone mode |
| **Deployment** | Vercel auto-deploy from `main` branch |
| **Auth** | None (intentional — no login required) |
| **DB** | None |
| **i18n** | Prompt says "respond in visitor's language" but no structured multilingual support |

**Verdict:** The bones are solid. The chat UX, tool cards, and PWA shell work. The fundamental gap is that the knowledge base is a flat string in the prompt — it can't scale, can't be searched semantically, and can't be updated without a code deploy.

---

## Gap Analysis: V1 → Product Vision

| Product Vision Requirement | V1 Status | Gap Severity |
|---|---|---|
| Exclusive interview-sourced knowledge | 18 businesses from web research, no interviews | 🔴 Critical |
| RAG-powered semantic retrieval | All data in system prompt (no retrieval) | 🔴 Critical |
| Multilingual (real i18n, not just "respond in their language") | Prompt-level only | 🟡 Medium |
| Conversation analytics / feedback loop | Zero analytics | 🔴 Critical |
| Business data refresh workflow | Requires code deploy | 🔴 Critical |
| QR code / kiosk / embed deployment | Web URL only | 🟡 Medium |
| Multi-variable query reasoning | Works (Claude handles this well) | 🟢 Done |
| Pre-trip + real-time assistance | Works | 🟢 Done |
| Conversational (not FAQ) personality | Works well | 🟢 Done |
| Weather/parking/beach/events tools | Working | 🟢 Done |
| Maps / wayfinding integration | Not built | 🟡 Medium |
| Business owner dashboard | Not built | 🟡 Medium |

---

## Architecture Decision: Build on V1 or Start Fresh?

**Recommendation: Fork the V1 codebase into `sam-v2` and evolve it.**

Reasons:
- The Next.js + Vercel AI SDK + Tailwind stack is correct for this product
- The chat UX, tool card system, and PWA shell are working and polished
- The system prompt personality is well-tuned
- Starting fresh would re-create ~80% of what already works

What needs to fundamentally change:
- Knowledge base moves from prompt → structured store + RAG
- Add a real persistence layer (conversations, analytics)
- Business data becomes a separate manageable entity
- Tool system expands (maps, business search, itinerary)

---

## Proposed Architecture

```
┌──────────────────────────────────────────┐
│              Visitor Devices             │
│  (QR scan, Web, PWA, Embedded Widget)   │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│          Next.js App (Vercel)            │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  │
│  │ Chat UI │  │ Tool     │  │ Admin  │  │
│  │ (React) │  │ Cards    │  │ Panel  │  │
│  └────┬────┘  └──────────┘  └───┬────┘  │
│       │                        │        │
│  ┌────▼────────────────────────▼─────┐  │
│  │         API Routes                │  │
│  │  /api/chat  /api/admin  /api/data │  │
│  └────┬──────────────────────────────┘  │
└───────┼──────────────────────────────────┘
        │
┌───────▼──────────────────────────────────┐
│           AI + Knowledge Layer           │
│  ┌──────────┐  ┌─────────────────────┐   │
│  │ Claude   │  │ RAG Pipeline        │   │
│  │ Sonnet   │  │ (Embed → Search →   │   │
│  │          │  │  Inject into prompt) │   │
│  └──────────┘  └─────────┬───────────┘   │
│                          │               │
│  ┌───────────────────────▼───────────┐   │
│  │    Vector Store (Pinecone)        │   │
│  │    Business profiles, interviews, │   │
│  │    logistics, insider knowledge   │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌───────────────────────────────────┐   │
│  │    Firebase / Firestore           │   │
│  │    Conversations, analytics,      │   │
│  │    business metadata, user prefs  │   │
│  └───────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## Phased Build Plan

### Phase 1: Foundation (Knowledge Base + RAG) — ~1 week
> *Move from "all businesses in the prompt" to "retrieve the right businesses per query"*

**1a. Business Data Schema + Structured Store**
- Define a structured business profile schema (JSON) covering all fields from interviews: basic info, hours, offerings, insider tips, experience flags, logistics, off-menu items, stories
- Store in **Firestore** (easy to update, admin-friendly, already have Firebase set up)
- Migrate all 18 existing businesses from `prompts.ts` into the structured store
- Build a simple data entry form (or use Firestore console) for adding new businesses

**1b. RAG Pipeline with Pinecone**
- Generate embeddings for each business profile using an embedding model
- Index into **Pinecone** (you already have MCP access to this)
- On each chat message: embed the user query → search Pinecone for top-K relevant businesses → inject those profiles into the system prompt context window
- This replaces the hardcoded business directory in `prompts.ts`
- The system prompt shrinks dramatically — now only personality + rules + dynamically retrieved businesses

**1c. Fork + Foundation**
- Copy `sam-bot/sam-chat` into `sam-v2`
- Update dependencies, clean up
- Wire up Firestore + Pinecone clients
- Modify `/api/chat/route.ts` to use RAG instead of static prompt

**Deliverable:** Same chat experience, but now powered by a real knowledge base that can scale to 200+ businesses without prompt bloat.

---

### Phase 2: Enhanced Chat Experience — ~1 week
> *Make the chat genuinely feel like talking to a knowledgeable local friend*

**2a. Richer Tool Cards**
- **Map card**: When recommending a place, show it on an embedded map with walking/driving directions from visitor's location
- **Business card**: Rich card with photo, hours, one-liner, and a "Get Directions" button
- **Itinerary card**: When Sam suggests a multi-stop plan, render it as a timeline

**2b. Structured Multilingual Support**
- Detect visitor language from first message (or browser locale)
- System prompt adapts language context
- Business descriptions stored with optional translated summaries for top languages (Spanish, Mandarin, Japanese, French, Korean)
- Tool card labels localized

**2c. Conversation Memory (Persistent)**
- Move from session-only `useState` to **Firestore** conversation storage
- Anonymous sessions via random ID (still no auth required)
- Optional: cookie-based session continuity ("Welcome back — last time you were looking for dinner spots, how was it?")

**2d. Interview Knowledge Integration**
- Build the interview data ingestion pipeline: structured Google Form or Markdown template → parsed JSON → Firestore + Pinecone
- Tag content types: `insider_tip`, `off_menu`, `chef_story`, `local_secret`, `logistics`
- Sam's prompt learns to differentiate: "Here's something the owner told me directly..." vs. standard info

**Deliverable:** Visually richer, multilingual, with persistent memory and a clear path for ingesting real interview data.

---

### Phase 3: Analytics + Business Value — ~1 week
> *Prove Sam's value to DTSM and the business community*

**3a. Conversation Intelligence**
- Log all conversations to Firestore (anonymized)
- Track: most-asked-about businesses, most common visitor needs, unanswered questions, language distribution, session duration
- Weekly automated summary: "Top 10 things visitors asked about this week"

**3b. DTSM Analytics Dashboard**
- Simple admin panel (protected route, basic auth)
- Charts: conversation volume over time, top businesses mentioned, visitor origins (from geo hints), language breakdown
- Exportable reports for DTSM leadership

**3c. Business Owner Value**
- Per-business stats: "Your business was recommended 47 times this month"
- What visitors asked before being recommended to you
- This becomes DTSM's proof point: "Sam sent 200 visitors to your businesses this quarter"

**Deliverable:** A dashboard that gives DTSM tangible metrics and gives business owners visible ROI.

---

### Phase 4: Production Hardening + Distribution — ~1 week
> *Deploy Sam everywhere a visitor might be*

**4a. QR Code + Embed System**
- Generate QR codes for physical placement (hotel lobbies, parking structures, beach access points, Promenade signage)
- Embeddable widget (`<script>` tag) for DTSM website and partner sites
- Deep-link support: QR at a parking structure opens Sam with "I just parked at Structure 4"

**4b. Rate Limiting + Cost Control**
- Vercel Edge Middleware for rate limiting
- Token usage tracking per conversation
- Auto-summarize long conversations to control context window costs

**4c. Monitoring + Error Handling**
- Graceful API failure handling (Claude API down, Pinecone timeout)
- Sentry or similar for error tracking
- Uptime monitoring

**4d. Performance**
- Edge-optimized API routes
- Streaming response optimization
- PWA offline shell (show cached business info even without network)

**Deliverable:** Production-ready system that works at scale across multiple physical and digital touchpoints.

---

## Key Technology Choices

| Component | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js (keep from v1) | Proven, Vercel-native, SSR + API routes |
| **LLM** | Claude Sonnet via Vercel AI SDK | Already working, great at conversational nuance |
| **Vector Store** | Pinecone | You have MCP access, managed service, good for RAG |
| **Database** | Firebase / Firestore | Already set up, real-time, easy admin, serverless |
| **Embeddings** | OpenAI `text-embedding-3-small` or Gemini embedding | Cost-effective, high quality |
| **Hosting** | Vercel | Already deployed there, edge network, auto-scaling |
| **Analytics** | Custom (Firestore-backed) | Full control, no third-party data sharing |
| **Styling** | Tailwind v4 (keep from v1) | Already in place, utility-first, fast iteration |

---

## What I'd Build First

If I were starting today, I'd do this in order:

1. **Fork `sam-chat` → `sam-v2`** and get it running locally
2. **Set up Firestore** with a `businesses` collection and migrate the 18 existing profiles
3. **Set up Pinecone** index and build the embedding + retrieval pipeline
4. **Rewire `/api/chat/route.ts`** to use RAG instead of static prompt
5. **Test**: same quality answers, but now from a scalable knowledge base

That's Phase 1a-1c. Everything else layers on top of this foundation.

---

## Open Questions for You

1. **Interview data**: Do you already have real interview transcripts/notes, or is the v1 web-research data all that exists right now? This changes whether Phase 2d is immediate or deferred.

2. **Business count target**: The product doc mentions scaling interviews. How many businesses are you targeting for launch? 50? 100? 200+? This affects whether Pinecone is needed now or if Firestore full-text search is sufficient for a while.

3. **World Cup timeline**: Several businesses have World Cup flags. Is there a hard deadline tied to the FIFA World Cup 2026 (June–July 2026)?

4. **DTSM branding**: Do you have brand guidelines, logos, color palette from DTSM for the UI, or is the current design direction (teal/seafoam theme) the right one?

5. **Budget constraints**: Claude API + Pinecone + Vercel Pro — any cost ceiling we should design around?

6. **Admin access**: Who needs to update business data? Just you, or do DTSM staff need a self-service admin panel?
