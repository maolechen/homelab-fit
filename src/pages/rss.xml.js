import { publishablePages } from "../data/homelab-pages.js";
import { siteConfig } from "../data/site.js";

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET({ site }) {
  const origin = site?.toString() ?? "https://homelab-fit.example.com";
  const items = [...publishablePages]
    .sort((a, b) => {
      const dateA = a.content?.updated_at ?? "1970-01-01";
      const dateB = b.content?.updated_at ?? "1970-01-01";
      return dateB.localeCompare(dateA) || b.opportunityScore - a.opportunityScore;
    })
    .slice(0, 50)
    .map((page) => {
      const url = new URL(`/wiki/${page.slug}/`, origin).toString();
      const updatedAt = page.content?.updated_at ? new Date(page.content.updated_at).toUTCString() : new Date().toUTCString();

      return `<item>
  <title>${escapeXml(page.displayTitle)}</title>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>
  <pubDate>${escapeXml(updatedAt)}</pubDate>
  <description>${escapeXml(page.cardDescription)}</description>
</item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${escapeXml(new URL("/", origin).toString())}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>${escapeXml(siteConfig.language)}</language>
  <lastBuildDate>${escapeXml(new Date().toUTCString())}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
}
