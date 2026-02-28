import { tool } from "ai";
import { z } from "zod";

export type BeachLocation = {
    id: string;
    name: string;
    waterQualityGrade: "A+" | "A" | "B" | "C" | "D" | "F";
    waterStatus: "Open" | "Warning" | "Closed"; // E.g., Bacterial advisory
    waterTempFahrenheit: number;
    surfHeightFeet: [number, number]; // [min, max] e.g., [2, 4]
    surfConditions: "Poor" | "Poor to Fair" | "Fair" | "Fair to Good" | "Good" | "Epic";
    tide: {
        type: "High" | "Low" | "Rising" | "Falling";
        heightFeet: number;
        time: string; // e.g., "11:42 AM"
    };
    description: string;
};

export const getBeachSafety = tool({
    description:
        "Get current water quality grades, water temperature, tide, and surf conditions for Santa Monica beaches (e.g., Santa Monica Pier, Ocean Park).",
    inputSchema: z.object({}), // No required parameters
    execute: async () => {
        // Simulated data for Santa Monica Beach locations
        // In a real application, this would fetch from Heal the Bay River Report API / Surfline API / NOAA

        const simulatedData: BeachLocation[] = [
            {
                id: "sm-pier",
                name: "Santa Monica Pier",
                waterQualityGrade: "A",
                waterStatus: "Open",
                waterTempFahrenheit: 62,
                surfHeightFeet: [2, 3],
                surfConditions: "Poor to Fair",
                tide: {
                    type: "Rising",
                    heightFeet: 3.2,
                    time: "1:15 PM"
                },
                description: "Small mix of SSW and WNW swell. Playable for longboards, but somewhat weak."
            },
            {
                id: "ocean-park",
                name: "Ocean Park Blvd",
                waterQualityGrade: "A+",
                waterStatus: "Open",
                waterTempFahrenheit: 61,
                surfHeightFeet: [2, 4],
                surfConditions: "Fair",
                tide: {
                    type: "Rising",
                    heightFeet: 3.2,
                    time: "1:15 PM"
                },
                description: "Slightly better shape than the pier. Good sandbars working on the incoming tide."
            }
        ];

        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 800));

        return simulatedData;
    },
});
