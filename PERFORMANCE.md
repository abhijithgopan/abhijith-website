# Performance notes

This version keeps the existing server-rendered Cloudflare architecture and focuses on reducing unnecessary work and network cost without changing the site's design.

## Changes

- Removed the duplicate weather/visitor script that had been embedded in the homepage. `WeatherFooter.astro` is now the single owner of that behaviour.
- Replaced the CSS `@import` for Inter with a normal stylesheet link and a preconnect in `BaseLayout.astro`, allowing the browser to discover the font stylesheet earlier.
- Reduced the profile image from a 960×960 PNG to a 192×192 WebP and moved it through Astro's image pipeline.
- Reduced photo thumbnail candidates from 960px to a maximum of 720px and set thumbnail quality to 78.
- Added short edge caching for Letterboxd RSS responses (10 minutes).
- Added short edge caching for Open-Meteo requests (5 minutes). The `/api/visitor` response itself remains `no-store` because it contains visitor-specific information.
- Added a 4-second timeout to external Letterboxd and weather requests so a slow third-party service cannot hold the page/API open indefinitely.
- Kept the site's static content, interactive charts, maps, photo viewer, 3:4 photo grid, and Cloudflare server output unchanged.

## Verification

Run locally with Node 22.12+:

```powershell
npm install
npm run build
```

Then test the production preview/deployment and compare the homepage, `/blog`, `/photos`, and `/now`.

### Profile image

The profile image intentionally remains as the original 960×960 PNG and is referenced directly from `/profile.png`. The header displays it at 32×32 CSS pixels, but the browser source remains the full-resolution image so opening or saving the image does not save a tiny Astro-generated thumbnail. This is a deliberate exception to thumbnail optimisation because the image is also a user-facing profile asset.
