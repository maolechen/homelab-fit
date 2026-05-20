# Launch Checklist

## Cloudflare Pages

- Project name: `homelab-fit`
- Temporary URL: `https://homelab-fit.pages.dev`
- Build command: `npm run audit:homelab && SITE_URL=https://homelab-fit.pages.dev npm run build`
- Output directory: `dist`
- Production branch for future Git integration: `main`

## Preflight

Run:

```bash
npm run content:promote
npm run audit:homelab
npm run audit:homelab
SITE_URL=https://homelab-fit.pages.dev npm run build
```

Check:

- `/`
- `/pages/`
- `/wiki/proxmox-mini-pc-nas-checklist/`
- `/wiki/proxmox-n100-vs-n305/`
- `/wiki/proxmox-local-lvm-vs-directory/`
- `/resources/homelab-build-checklist/`
- `/sitemap-index.xml`
- `/robots.txt`

## Domain Hold

Do not configure a custom domain until a final domain is purchased. Keep canonical URLs on the Pages temporary domain until then.
