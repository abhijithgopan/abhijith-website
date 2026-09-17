import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export const GET: APIRoute = async ({ site, url }) => {
  const origin = site?.origin ?? url.origin;
  const posts = await getCollection("blog");

  const staticPages = ["/", "/blog", "/photos", "/now"];
  const blogPages = posts.map((post) => `/blog/${post.id}`);

  const urls = [
    ...staticPages.map((path) => ({ loc: `${origin}${path}`, lastmod: undefined })),
    ...blogPages.map((path) => {
      const id = path.replace("/blog/", "");
      const post = posts.find((entry) => entry.id === id);
      return {
        loc: `${origin}${path}`,
        lastmod: post?.data.date.toISOString(),
      };
    }),
  ];

  const body = urls
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    },
  );
};
