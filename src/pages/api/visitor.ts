import type { APIRoute } from "astro";
import { createWeatherUrl, getWeatherDescription, HOME_LOCATION } from "../../lib/weather";

type CloudflareRequest = Request & {
  cf?: {
    city?: string | null;
    country?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    region?: string | null;
    timezone?: string | null;
  };
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistance(latitude: number, longitude: number) {
  const earthRadius = 6371;
  const latitudeDifference = toRadians(latitude - HOME_LOCATION.latitude);
  const longitudeDifference = toRadians(longitude - HOME_LOCATION.longitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(HOME_LOCATION.latitude)) *
      Math.cos(toRadians(latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function normaliseWeather(current: Record<string, unknown> | undefined) {
  const code = current?.weather_code;
  const numericCode = typeof code === "number" ? code : null;

  return {
    temperature: typeof current?.temperature_2m === "number" ? current.temperature_2m : null,
    feelsLike: typeof current?.apparent_temperature === "number" ? current.apparent_temperature : null,
    code: numericCode,
    description: numericCode === null ? null : getWeatherDescription(numericCode),
  };
}

export const GET: APIRoute = async ({ request }) => {
  const cf = (request as CloudflareRequest).cf;

  const latitude = Number(cf?.latitude);
  const longitude = Number(cf?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return json({
      available: false,
      message: "Visitor location is not available.",
    });
  }

  const distance = calculateDistance(latitude, longitude);

  try {
    const [visitorResponse, homeResponse] = await Promise.all([
      fetch(createWeatherUrl(latitude, longitude), {
        cf: { cacheTtl: 300, cacheEverything: true },
        signal: AbortSignal.timeout(4000),
      } as RequestInit),
      fetch(createWeatherUrl(HOME_LOCATION.latitude, HOME_LOCATION.longitude, HOME_LOCATION.timezone), {
        cf: { cacheTtl: 300, cacheEverything: true },
        signal: AbortSignal.timeout(4000),
      } as RequestInit),
    ]);

    if (!visitorResponse.ok || !homeResponse.ok) {
      throw new Error("Weather request failed.");
    }

    const [visitorWeather, homeWeather] = await Promise.all([
      visitorResponse.json(),
      homeResponse.json(),
    ]);

    return json({
      available: true,
      visitor: {
        city: cf?.city ?? null,
        region: cf?.region ?? null,
        country: cf?.country ?? null,
        timezone: cf?.timezone ?? null,
        distance: { kilometers: Math.round(distance) },
        weather: normaliseWeather(visitorWeather.current),
        localTime: visitorWeather.current?.time ?? null,
      },
      me: {
        city: HOME_LOCATION.city,
        timezone: HOME_LOCATION.timezone,
        weather: normaliseWeather(homeWeather.current),
        localTime: homeWeather.current?.time ?? null,
      },
    });
  } catch (error) {
    console.error("Weather request failed:", error);

    return json({
      available: true,
      visitor: {
        city: cf?.city ?? null,
        region: cf?.region ?? null,
        country: cf?.country ?? null,
        timezone: cf?.timezone ?? null,
        distance: { kilometers: Math.round(distance) },
        weather: null,
        localTime: null,
      },
      me: {
        city: HOME_LOCATION.city,
        timezone: HOME_LOCATION.timezone,
        weather: null,
        localTime: null,
      },
    });
  }
};
