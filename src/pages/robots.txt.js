const fallbackSite = "https://homelab-fit.example.com";

export function GET({ site }) {
  const origin = site?.toString() ?? fallbackSite;
  const sitemapUrl = new URL("/sitemap-index.xml", origin).toString();

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
