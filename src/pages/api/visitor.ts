import type { APIRoute } from "astro";

const ABHIJITH = {
  city: "Delhi",
  latitude: 28.6139,
  longitude: 77.2090,
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
    toRadians(latitude - ABHIJITH.latitude);

  const longitudeDifference =
    toRadians(longitude - ABHIJITH.longitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(toRadians(ABHIJITH.latitude)) *
        Math.cos(toRadians(latitude)) *
        Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

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
  if ([96, 99].includes(code)) {
    return "Thunderstorm with hail";
  }

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

  const visitorWeatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    "&current=temperature_2m,apparent_temperature,weather_code" +
    "&temperature_unit=celsius" +
    "&timezone=auto";

  const delhiWeatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${ABHIJITH.latitude}` +
    `&longitude=${ABHIJITH.longitude}` +
    "&current=temperature_2m,apparent_temperature,weather_code" +
    "&temperature_unit=celsius" +
    "&timezone=Asia%2FKolkata";

  try {
    const [
      visitorWeatherResponse,
      delhiWeatherResponse,
    ] = await Promise.all([
      fetch(visitorWeatherUrl),
      fetch(delhiWeatherUrl),
    ]);

    if (
      !visitorWeatherResponse.ok ||
      !delhiWeatherResponse.ok
    ) {
      throw new Error("Weather request failed.");
    }

    const visitorWeather =
      await visitorWeatherResponse.json();

    const delhiWeather =
      await delhiWeatherResponse.json();

    const visitorWeatherCode =
      visitorWeather.current?.weather_code;

    const delhiWeatherCode =
      delhiWeather.current?.weather_code;

    return new Response(
      JSON.stringify({
        available: true,

        visitor: {
          city: cf.city ?? null,
          region: cf.region ?? null,
          country: cf.country ?? null,
          latitude,
          longitude,
          timezone: cf.timezone ?? null,

          distance: {
            kilometers: Math.round(distance),
          },

          weather: {
            temperature:
              visitorWeather.current?.temperature_2m ??
              null,
            feelsLike:
              visitorWeather.current?.apparent_temperature ??
              null,
            code:
              typeof visitorWeatherCode === "number"
                ? visitorWeatherCode
                : null,
            description:
              typeof visitorWeatherCode === "number"
                ? getWeatherDescription(
                    visitorWeatherCode
                  )
                : null,
          },

          localTime:
            visitorWeather.current?.time ?? null,
        },

        me: {
          city: ABHIJITH.city,
          timezone: "Asia/Kolkata",

          weather: {
            temperature:
              delhiWeather.current?.temperature_2m ??
              null,
            feelsLike:
              delhiWeather.current?.apparent_temperature ??
              null,
            code:
              typeof delhiWeatherCode === "number"
                ? delhiWeatherCode
                : null,
            description:
              typeof delhiWeatherCode === "number"
                ? getWeatherDescription(
                    delhiWeatherCode
                  )
                : null,
          },

          localTime:
            delhiWeather.current?.time ?? null,
        },
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
    console.error(
      "Weather request failed:",
      error
    );

    return new Response(
      JSON.stringify({
        available: true,

        visitor: {
          city: cf.city ?? null,
          region: cf.region ?? null,
          country: cf.country ?? null,
          latitude,
          longitude,
          timezone: cf.timezone ?? null,

          distance: {
            kilometers: Math.round(distance),
          },

          weather: null,
          localTime: null,
        },

        me: {
          city: ABHIJITH.city,
          timezone: "Asia/Kolkata",
          weather: null,
          localTime: null,
        },
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