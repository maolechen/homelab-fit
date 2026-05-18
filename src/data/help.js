export const helpEmail = import.meta.env.PUBLIC_HELP_EMAIL || "";

export const highIntentHelpSlugs = new Set([
  "proxmox-no-network-after-install",
  "hba-passthrough-truenas-vm",
  "proxmox-zfs-mirror-mini-pc",
  "proxmox-mini-pc-nas-checklist",
  "proxmox-storage-layout-checklist"
]);

export function getHelpHref(subject = "Proxmox homelab build brief") {
  if (!helpEmail) {
    return "/help/#build-template";
  }

  const body = [
    "Proxmox build or issue:",
    "",
    "Hardware:",
    "- CPU / mini PC model:",
    "- RAM:",
    "- NIC model:",
    "- Storage devices:",
    "",
    "Planned workloads:",
    "",
    "Current problem or decision:",
    "",
    "What I already checked:",
    "",
    "Notes or logs:",
    ""
  ].join("\n");

  return `mailto:${helpEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
