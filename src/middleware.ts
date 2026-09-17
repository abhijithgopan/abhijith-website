import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // HSTS is only useful over HTTPS. Avoid sending it to local development.
  const requestUrl = new URL(_context.request.url);
  if (requestUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000");
  }

  return response;
});
