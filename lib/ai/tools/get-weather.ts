import { tool } from "ai";
import { z } from "zod";

// Downtown Santa Monica default coordinates
const SANTA_MONICA_LAT = 34.0195;
const SANTA_MONICA_LON = -118.4912;

async function geocodeCity(
  city: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch {
    return null;
  }
}

export const getWeather = tool({
  description:
    "Get the current weather at a location. Defaults to Santa Monica if no location is provided. Use city name 'Santa Monica' for local weather.",
  inputSchema: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    city: z
      .string()
      .describe("City name (e.g., 'Santa Monica', 'Los Angeles')")
      .optional(),
  }),
  execute: async (input) => {
    let latitude: number;
    let longitude: number;
    let cityName: string | undefined;

    if (input.city) {
      const coords = await geocodeCity(input.city);
      if (!coords) {
        return {
          error: `Could not find coordinates for "${input.city}". Please check the city name.`,
        };
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
      cityName = input.city;
    } else if (input.latitude !== undefined && input.longitude !== undefined) {
      latitude = input.latitude;
      longitude = input.longitude;
    } else {
      // Default to Santa Monica
      latitude = SANTA_MONICA_LAT;
      longitude = SANTA_MONICA_LON;
      cityName = "Santa Monica";
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto&temperature_unit=fahrenheit`
    );

    const weatherData = await response.json();

    if (cityName) {
      weatherData.cityName = cityName;
    }

    return weatherData;
  },
});
