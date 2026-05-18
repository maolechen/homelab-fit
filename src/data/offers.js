const offersByType = {
  hardware_fit: {
    eyebrow: "Buyer checklist",
    title: "Turn this hardware fit into a pre-buy scorecard",
    body: "Compare CPU, RAM ceiling, NIC model, storage slots, cooling, BIOS options, and backup path before ordering parts.",
    href: "/resources/homelab-build-checklist/",
    label: "Open checklist"
  },
  networking_fit: {
    eyebrow: "Network check",
    title: "Validate the NIC before migrating workloads",
    body: "Record link speed, bridge mapping, switch port, cable, and sustained-transfer behavior while rollback is still easy.",
    href: "/resources/homelab-build-checklist/",
    label: "Open checklist"
  },
  storage_fit: {
    eyebrow: "Storage plan",
    title: "Map the drive layout before trusting data to it",
    body: "Use a storage checklist to separate Proxmox boot, VM storage, NAS ownership, redundancy, and off-box backups.",
    href: "/templates/#storage-planners",
    label: "View storage planners"
  },
  passthrough_fit: {
    eyebrow: "Passthrough review",
    title: "Check isolation and recovery before passthrough",
    body: "IOMMU, device ownership, boot separation, and rollback notes matter more than copying a single command.",
    href: "/templates/#passthrough-briefs",
    label: "View passthrough briefs"
  },
  comparison: {
    eyebrow: "Decision brief",
    title: "Compare tradeoffs before buying or rebuilding",
    body: "Use fit criteria and failure modes to pick the simpler architecture before the hardware is already on your desk.",
    href: "/templates/#decision-briefs",
    label: "View decision briefs"
  },
  error_fix: {
    eyebrow: "Fix checklist",
    title: "Capture the host facts before changing config",
    body: "Network and storage fixes get faster when interface names, bridge layout, switch ports, and recent changes are written down.",
    href: "/resources/homelab-build-checklist/",
    label: "Open checklist"
  },
  buyer_checklist: {
    eyebrow: "Build planning",
    title: "Use the homelab pre-buy checklist",
    body: "Score the host, NIC, storage, RAM, cooling, and backup path before committing to a mini PC NAS build.",
    href: "/resources/homelab-build-checklist/",
    label: "Open checklist"
  },
  ops_checklist: {
    eyebrow: "Ops review",
    title: "Turn the build into something recoverable",
    body: "Backups, UPS behavior, update notes, and restore checks decide whether a homelab survives normal mistakes.",
    href: "/templates/#ops-runbooks",
    label: "View ops runbooks"
  }
};

export const featuredOffers = [
  {
    id: "buyer-scorecards",
    eyebrow: "Hardware",
    title: "Mini PC buyer scorecards",
    body: "Pre-buy checks for CPU family, RAM ceiling, NIC model, M.2/SATA layout, cooling, and noise.",
    fit: "Best for readers comparing N100, N305, Ryzen, and workstation-style mini PCs before purchase.",
    pages: ["proxmox-mini-pc-nas-checklist", "intel-n100-proxmox-nas", "minisforum-ms-01-proxmox"]
  },
  {
    id: "storage-planners",
    eyebrow: "Storage",
    title: "Proxmox storage planners",
    body: "Layouts for ZFS mirror, local-lvm, NVMe vs SATA, NAS VM ownership, and off-box backup paths.",
    fit: "Best for builders trying to avoid repainting the whole storage stack after install.",
    pages: ["proxmox-zfs-mirror-mini-pc", "proxmox-storage-layout-checklist", "proxmox-nvme-vs-sata-nas"]
  },
  {
    id: "passthrough-briefs",
    eyebrow: "Passthrough",
    title: "Passthrough readiness briefs",
    body: "IOMMU, device isolation, controller ownership, boot separation, and recovery notes for HBA, GPU, and USB passthrough.",
    fit: "Best for builders planning TrueNAS, GPU workloads, or Home Assistant USB devices inside VMs.",
    pages: ["hba-passthrough-truenas-vm", "gpu-passthrough-checklist", "usb-passthrough-home-assistant"]
  },
  {
    id: "ops-runbooks",
    eyebrow: "Operations",
    title: "Homelab operations runbooks",
    body: "Backup, UPS, install, cluster, and network recovery notes for small Proxmox hosts.",
    fit: "Best for users moving from a fun lab into something that stores data they care about.",
    resourceHref: "/resources/homelab-build-checklist/",
    resourceLabel: "Open free checklist",
    pages: ["proxmox-backup-mini-pc", "proxmox-no-network-after-install", "proxmox-installation-checklist"]
  },
  {
    id: "decision-briefs",
    eyebrow: "Decision",
    title: "Architecture decision briefs",
    body: "Short comparisons for Proxmox vs TrueNAS Scale, LXC vs VM, firewall host fit, and low-power tradeoffs.",
    fit: "Best for readers choosing the platform shape before buying hardware.",
    pages: ["proxmox-vs-truenas-scale-mini-pc", "proxmox-lxc-vs-vm-homelab", "proxmox-low-power-homelab"]
  }
];

export function getOfferForPage(page) {
  return offersByType[page.intentType] ?? offersByType[page.page_type] ?? offersByType.buyer_checklist;
}
