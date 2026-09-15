import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
  const cf = (
    request as Request & {
      cf?: {
        city?: string | null;
        country?: string | null;
        latitude?: string | null;
        longitude?: string | null;
        region?: string | null;
        timezone?: string | null;
        postalCode?: string | null;
      };
    }
  ).cf;

  if (!cf) {
    return new Response(
      JSON.stringify({
        available: false,
        message: "Cloudflare location data is not available.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      available: true,
      city: cf.city ?? null,
      country: cf.country ?? null,
      region: cf.region ?? null,
      latitude: cf.latitude ?? null,
      longitude: cf.longitude ?? null,
      timezone: cf.timezone ?? null,
      postalCode: cf.postalCode ?? null,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
};