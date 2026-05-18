import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { recordsFromCsv } from "./csv.js";

const inventoryCsv = readFileSync(resolve("data/homelab-page-inventory.csv"), "utf8");
const generatedCsv = readFileSync(resolve("data/homelab-generated-page-ideas.csv"), "utf8");
const contentPath = resolve("data/homelab-page-content.json");
const pageContent = existsSync(contentPath)
  ? JSON.parse(readFileSync(contentPath, "utf8"))
  : {};

const inventoryPages = [
  ...recordsFromCsv(inventoryCsv),
  ...recordsFromCsv(generatedCsv)
];

export const pages = inventoryPages.map((page) => {
  const content = pageContent[page.slug] ?? null;
  const opportunityScore = Number(content?.opportunity_score ?? page.priority_1_to_5 ?? 0);
  const valueTier = !content ? "C" : opportunityScore >= 88 ? "A" : "B";

  return {
    ...page,
    priority: Number(page.priority_1_to_5 || 0),
    source_url: page.source_url || "https://pve.proxmox.com/pve-docs/",
    content,
    isPublishable: Boolean(content),
    displayTitle: content?.h1 ?? page.title,
    seoTitle: content?.seo_title ?? `${page.title} | Homelab Fit`,
    cardDescription: content?.meta_description ?? content?.summary ?? page.search_intent,
    intentType: content?.intent_type ?? page.page_type,
    opportunityScore,
    valueTier,
    valueTierLabel: valueTier === "A" ? "A: promote" : valueTier === "B" ? "B: support" : "C: noindex"
  };
});

export const pageTypes = [...new Set(pages.map((page) => page.page_type))].sort();
export const publishablePages = pages.filter((page) => page.isPublishable);

export function getPageBySlug(slug) {
  return pages.find((page) => page.slug === slug);
}

export function getRelatedPages(page, limit = 5) {
  const explicit = page.content?.related_slugs
    ?.map((slug) => getPageBySlug(slug))
    .filter(Boolean) ?? [];

  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  const fallback = pages
    .filter((candidate) => candidate.slug !== page.slug && candidate.page_type === page.page_type)
    .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title));

  return [...explicit, ...fallback.filter((candidate) => !explicit.includes(candidate))].slice(0, limit);
}
