import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { recordsFromCsv } from "../src/data/csv.js";

const manualPages = recordsFromCsv(readFileSync(resolve("data/homelab-page-inventory.csv"), "utf8"));
const generatedPages = recordsFromCsv(readFileSync(resolve("data/homelab-generated-page-ideas.csv"), "utf8"));
const pages = [...manualPages, ...generatedPages];
const content = JSON.parse(readFileSync(resolve("data/homelab-page-content.json"), "utf8"));
const slugs = pages.map((page) => page.slug);
const uniqueSlugs = new Set(slugs);
const readerReady = Object.entries(content).filter(([, item]) => item.status !== "supporting_draft" && item.indexable !== false);

if (uniqueSlugs.size !== slugs.length) {
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  throw new Error(`Duplicate slugs found: ${[...new Set(duplicates)].join(", ")}`);
}

for (const slug of Object.keys(content)) {
  if (!uniqueSlugs.has(slug)) {
    throw new Error(`Content exists for unknown slug: ${slug}`);
  }

  const item = content[slug];
  const requiredArrays = [
    "facts",
    "steps",
    "warnings",
    "verification",
    "sources",
    "applies_to",
    "best_for",
    "not_for",
    "common_mistakes",
    "examples",
    "faq",
    "related_slugs"
  ];
  for (const key of requiredArrays) {
    if (!Array.isArray(item[key]) || item[key].length === 0) {
      throw new Error(`${slug} is missing required array: ${key}`);
    }
  }

  for (const source of item.sources) {
    if (!source.title || !source.url || !source.accessed_at) {
      throw new Error(`${slug} has incomplete source metadata`);
    }
  }

  if (!item.summary || !item.updated_at || !item.meta_description || !item.h1 || !item.seo_title) {
    throw new Error(`${slug} is missing summary, updated_at, h1, seo_title, or meta_description`);
  }

  const isReaderReady = item.status !== "supporting_draft" && item.indexable !== false;
  if (isReaderReady) {
    const requiredReaderFields = [
      "quick_answer",
      "verdict",
      "decision_scores",
      "reading_path",
      "safe_default",
      "decision_matrix",
      "saveable_summary"
    ];
    for (const key of requiredReaderFields) {
      if (!item[key] || (Array.isArray(item[key]) && item[key].length === 0)) {
        throw new Error(`${slug} is reader-ready but missing ${key}`);
      }
    }

    if (!Array.isArray(item.reading_path) || item.reading_path.length < 3) {
      throw new Error(`${slug} needs at least 3 reading path items`);
    }

    for (const next of item.reading_path) {
      if (!next.slug || !uniqueSlugs.has(next.slug)) {
        throw new Error(`${slug} has an invalid reading path item: ${JSON.stringify(next)}`);
      }
    }

    if (!Array.isArray(item.faq) || item.faq.length < 5) {
      throw new Error(`${slug} needs at least 5 FAQ items`);
    }

    if (!Array.isArray(item.decision_scores) || item.decision_scores.length < 5) {
      throw new Error(`${slug} needs at least 5 decision scores`);
    }
  }

  for (const relatedSlug of item.related_slugs) {
    if (!uniqueSlugs.has(relatedSlug)) {
      throw new Error(`${slug} links to unknown related slug: ${relatedSlug}`);
    }
  }
}

if (Object.keys(content).length < 80) {
  throw new Error(`Expected at least 80 source-backed drafts, found ${Object.keys(content).length}`);
}

if (readerReady.length < 30) {
  throw new Error(`Expected at least 30 reader-ready guides, found ${readerReady.length}`);
}

const typeCounts = pages.reduce((counts, page) => {
  counts[page.page_type] = (counts[page.page_type] ?? 0) + 1;
  return counts;
}, {});

console.log(`Total candidates: ${pages.length}`);
console.log(`Source-backed notes: ${Object.keys(content).length}`);
console.log(`Reader-ready guides: ${readerReady.length}`);
console.log(`Supporting drafts: ${Object.keys(content).length - readerReady.length}`);
console.log(`Noindex drafts: ${pages.length - Object.keys(content).length}`);
console.log("Page types:");
for (const [type, count] of Object.entries(typeCounts).sort()) {
  console.log(`- ${type}: ${count}`);
}
