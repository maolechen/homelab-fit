# Content Schema

Each key in `data/homelab-page-content.json` maps to a page slug from the inventory CSV files.

## Required Fields

- `status`: usually `publishable_draft`
- `updated_at`: ISO date
- `summary`: direct answer for the page header and quick answer
- `applies_to`: array of hardware/software contexts
- `intent_type`: one of the page type families
- `opportunity_score`: numeric priority score
- `facts`: array of `[label, value]` pairs
- `steps`: recommended checks or actions
- `warnings`: risks and caveats
- `verification`: checks proving the reader is done
- `sources`: array of `{ title, url, accessed_at }`
- `seo_title`
- `h1`
- `meta_description`

## Recommended Fields

- `best_for`
- `not_for`
- `common_mistakes`
- `examples`
- `faq`
- `related_slugs`

## Page Type Notes

`hardware_fit` pages should not claim exact specs until the specific model has a source. Use the page to check fit criteria, not invent a complete spec sheet.

`networking_fit` pages should separate driver, bridge, switch, cable, VLAN, and power-management causes.

`storage_fit` pages should always distinguish redundancy from backup.

`passthrough_fit` pages should include recovery and ownership warnings.

`comparison` pages should make the decision criteria explicit instead of declaring one option universally better.
