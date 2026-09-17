# V10 production hardening

This version adds the production-facing foundations for the site without changing its visual design.

## Metadata

- Canonical URLs are generated from the current request origin.
- Open Graph metadata is added to every page.
- Twitter card metadata is added to every page.
- Article pages expose published time and Article JSON-LD.
- Pages use a default profile image for social previews.

## Discovery

- `/sitemap.xml` lists the main pages and blog posts.
- `/robots.txt` points crawlers to the sitemap.
- `/rss.xml` provides a lightweight feed of the blog.
- `/site.webmanifest` provides basic install metadata.

## Security headers

The middleware adds conservative headers that do not interfere with the site's current external resources:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `X-Frame-Options: SAMEORIGIN`

The browser does not need geolocation permission for the visitor-distance feature because that feature uses server-side request information.

## Verification

Run locally:

```sh
npm run build
npm run dev
```

After deployment, verify:

- `/robots.txt`
- `/sitemap.xml`
- `/rss.xml`
- canonical URL in page source
- Open Graph tags in page source
- a blog article's JSON-LD
- `/404`


## V11 final audit

This release is intended as the production baseline after the visual, accessibility, performance, and SEO passes.

### Final checks

Run these locally before deployment:

```sh
npm install
npm run build
npm run dev
```

Verify these routes:

- `/`
- `/blog`
- `/blog/<post-slug>`
- `/photos`
- `/now`
- `/404`
- `/robots.txt`
- `/sitemap.xml`
- `/rss.xml`

### Browser checks

- Light and dark themes
- Keyboard-only navigation
- Skip-to-content link
- Photo viewer keyboard and touch navigation
- Two-column 3:4 photo grid on phones
- No horizontal page overflow
- Long article titles and tables
- External links

### Cloudflare checks

After deployment, confirm that the production response includes the security headers from `src/middleware.ts`, that the sitemap uses the production origin, and that the visitor/weather endpoint still works.

The site intentionally remains server-rendered because the visitor/weather feature uses request metadata and server-side API calls. Do not switch the site to a static-only build without first redesigning that feature.
