import type { APIRoute } from "astro";

const DEL = {
  latitude: 28.5562,
  longitude: 77.1000,
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistance(
  latitude: number,
  longitude: number
) {
  const earthRadius = 6371;

  const latitudeDifference =
    toRadians(latitude - DEL.latitude);

  const longitudeDifference =
    toRadians(longitude - DEL.longitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(DEL.latitude)) *
      Math.cos(toRadians(latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function getWeatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([56, 57].includes(code)) return "Freezing drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if ([96, 99].includes(code)) return "Thunderstorm with hail";

  return "Unknown";
}

export const GET: APIRoute = async ({ request }) => {
  const cf = (
    request as Request & {
      cf?: {
        city?: string | null;
        country?: string | null;
        latitude?: string | null;
        longitude?: string | null;
        region?: string | null;
        timezone?: string | null;
      };
    }
  ).cf;

  if (!cf?.latitude || !cf?.longitude) {
    return new Response(
      JSON.stringify({
        available: false,
        message: "Visitor location is not available.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const latitude = Number(cf.latitude);
  const longitude = Number(cf.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return new Response(
      JSON.stringify({
        available: false,
        message: "Visitor coordinates are invalid.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const distance = calculateDistance(
    latitude,
    longitude
  );

  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    "&current=temperature_2m,apparent_temperature,weather_code" +
    "&temperature_unit=celsius" +
    "&wind_speed_unit=kmh" +
    "&timezone=auto";

  try {
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather request failed: ${weatherResponse.status}`
      );
    }

    const weather = await weatherResponse.json();

    return new Response(
      JSON.stringify({
        available: true,

        location: {
          city: cf.city ?? null,
          region: cf.region ?? null,
          country: cf.country ?? null,
          latitude,
          longitude,
          timezone: cf.timezone ?? null,
        },

        airport: {
          name: "Indira Gandhi International Airport",
          code: "DEL",
        },

        distance: {
          kilometers: Math.round(distance),
        },

        weather: {
          temperature:
            weather.current?.temperature_2m ?? null,
          feelsLike:
            weather.current?.apparent_temperature ?? null,
          code:
            weather.current?.weather_code ?? null,
          description:
            typeof weather.current?.weather_code === "number"
              ? getWeatherDescription(
                  weather.current.weather_code
                )
              : null,
        },

        localTime:
          weather.current?.time ?? null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Weather request failed:", error);

    return new Response(
      JSON.stringify({
        available: true,

        location: {
          city: cf.city ?? null,
          region: cf.region ?? null,
          country: cf.country ?? null,
          latitude,
          longitude,
          timezone: cf.timezone ?? null,
        },

        airport: {
          name: "Indira Gandhi International Airport",
          code: "DEL",
        },

        distance: {
          kilometers: Math.round(distance),
        },

        weather: null,

        localTime: null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }
};