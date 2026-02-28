import { tool } from "ai";
import { z } from "zod";

export type ParkingStructure = {
    id: string;
    name: string;
    availableSpots: number;
    totalSpots: number;
    status: "green" | "yellow" | "red"; // green: >20% avail, yellow: 5-20% avail, red: <5% avail or full
    location: {
        lat: number;
        lng: number;
    };
};

export const getParking = tool({
    description:
        "Get real-time parking availability for parking structures in Downtown Santa Monica near the Third Street Promenade.",
    inputSchema: z.object({}), // No required parameters to just fetch the downtown lots
    execute: async () => {
        // Generate some simulated data for Downtown Santa Monica Parking Structures
        // In a real application, this would fetch from the Santa Monica Open Data Portal

        const simulatedData: ParkingStructure[] = [
            {
                id: "struct-1",
                name: "Structure 1",
                availableSpots: 142,
                totalSpots: 500,
                status: "green",
                location: { lat: 34.0153, lng: -118.4984 },
            },
            {
                id: "struct-2",
                name: "Structure 2",
                availableSpots: 45,
                totalSpots: 450,
                status: "yellow",
                location: { lat: 34.0165, lng: -118.4972 },
            },
            {
                id: "struct-3",
                name: "Structure 3 (Promenade)",
                availableSpots: 0,
                totalSpots: 600,
                status: "red",
                location: { lat: 34.0177, lng: -118.4960 },
            },
            {
                id: "struct-4",
                name: "Structure 4",
                availableSpots: 210,
                totalSpots: 400,
                status: "green",
                location: { lat: 34.0189, lng: -118.4948 },
            },
            {
                id: "struct-5",
                name: "Structure 5",
                availableSpots: 12,
                totalSpots: 350,
                status: "red",
                location: { lat: 34.0201, lng: -118.4936 },
            },
        ];

        // Optional: introduce a slight delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 600));

        return simulatedData;
    },
});
