import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const site = process.env.SITE_URL || "https://homelab-fit.example.com";
const content = JSON.parse(readFileSync(resolve("data/homelab-page-content.json"), "utf8"));
const publishableWikiPaths = new Set(Object.keys(content).map((slug) => `/wiki/${slug}/`));

export default defineConfig({
  site,
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith("/wiki/") || publishableWikiPaths.has(path);
      }
    })
  ]
});
