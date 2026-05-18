# Homelab Fit Static Compatibility Wiki

Homelab Fit is a static niche wiki MVP for Proxmox homelab builders choosing mini PCs, NICs, storage layouts, and passthrough setups.

The site is designed as a source-backed compatibility and troubleshooting database, not a generic tutorial blog. The first MVP should validate whether hardware-specific Proxmox and mini PC NAS pages can earn search impressions, clicks, and buying-intent engagement.

## Current Direction

- Audience: Proxmox homelab builders, mini PC NAS buyers, self-hosters, and small operators.
- Core promise: help readers decide whether a hardware or storage setup fits their Proxmox use case before they buy or rebuild.
- Commercial paths: mini PC affiliate, SSD/RAM/NIC/HBA affiliate, backup tools, monitoring, remote support, and paid build checklists.

## Run

```bash
npm install --cache .npm-cache
npm run audit:homelab
npm run build
npm run dev -- --port 4321
```

## MVP Rule

Ship 80-120 source-backed pages before broad expansion:

- Hardware compatibility pages from `data/homelab-page-inventory.csv`
- Generated candidate pages from `data/homelab-generated-page-ideas.csv`
- Networking and driver issue pages
- ZFS/storage decision pages
- Passthrough and VM build pages
- Buyer checklist and comparison pages

Manual core pages should stay in `homelab-page-inventory.csv`. Batch ideas should go in `homelab-generated-page-ideas.csv` until they prove search or commercial value.

Each indexable page needs sources, updated date, applies-to context, key facts, recommended checks, verification steps, warnings, and a commercial or checklist path.
