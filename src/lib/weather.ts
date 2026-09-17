export const HOME_LOCATION = {
  city: "Delhi",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
};

export function getWeatherDescription(code: number) {
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

export function createWeatherUrl(
  latitude: number,
  longitude: number,
  timezone = "auto",
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,apparent_temperature,weather_code",
    temperature_unit: "celsius",
    timezone,
  });

  return `https://api.open-meteo.com/v1/forecast?${params}`;
}
