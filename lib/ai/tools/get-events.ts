import { tool } from "ai";
import { z } from "zod";

export type CalendarEvent = {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    category: "Music" | "Art" | "Community" | "Food" | "Fitness";
    imageUrl?: string;
};

export const getEvents = tool({
    description: "Get scheduled events and programming (concerts, markets, festivals, community activities) happening in Downtown Santa Monica, the Pier, and Third Street Promenade. Do not use for general place or business recommendations.",
    inputSchema: z.object({
        category: z.enum(["Music", "Art", "Community", "Food", "Fitness"]).optional().describe("Optional filter by event category"),
    }),
    execute: async ({ category }) => {
        // Generate some simulated data for Downtown Santa Monica Events
        // In a real application, this would fetch from the Santa Monica Open Data Portal

        // Future integration note:
        // API endpoint: https://data.smgov.net/resource/xxxx-xxxx.json
        // Requires mapping the city's JSON structure to our CalendarEvent type.

        const allEvents: CalendarEvent[] = [
            {
                id: "evt-1",
                title: "Salsa on the Promenade",
                date: "This Friday",
                time: "6:00 PM - 9:00 PM",
                location: "Third Street Promenade (1300 block)",
                description: "Join us for an evening of free salsa dancing under the stars. Live band and beginner instructions at 6 PM.",
                category: "Music",
            },
            {
                id: "evt-2",
                title: "Downtown Farmers Market",
                date: "This Saturday",
                time: "8:00 AM - 1:00 PM",
                location: "Arizona Ave (between 2nd & 4th)",
                description: "The famous Santa Monica Farmers Market featuring the best local produce, artisanal goods, and street performers.",
                category: "Food",
            },
            {
                id: "evt-3",
                title: "Beach Yoga at Lifeguard Tower 26",
                date: "This Sunday",
                time: "9:00 AM - 10:00 AM",
                location: "Santa Monica Beach (Tower 26)",
                description: "Start your Sunday morning right with a community yoga session facing the ocean. Bring your own mat and sunscreen.",
                category: "Fitness",
            },
            {
                id: "evt-4",
                title: "Local Artisans Pop-up Market",
                date: "Next Saturday",
                time: "11:00 AM - 5:00 PM",
                location: "Santa Monica Place (Center Plaza)",
                description: "Discover handmade crafts, jewelry, and art from over 40 local Los Angeles makers.",
                category: "Art",
            },
            {
                id: "evt-5",
                title: "Pier Locals Night",
                date: "Next Thursday",
                time: "4:00 PM - 10:00 PM",
                location: "Santa Monica Pier",
                description: "A community celebration featuring local bands, discounted rides, classic car shows, and youth activities.",
                category: "Community",
            }
        ];

        // Optional: introduce a slight delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Filter if category is provided
        if (category) {
            return allEvents.filter(e => e.category === category);
        }

        return allEvents;
    },
});
