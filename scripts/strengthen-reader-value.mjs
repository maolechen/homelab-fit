import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const contentPath = resolve("data/homelab-page-content.json");
const content = JSON.parse(readFileSync(contentPath, "utf8"));
const reviewDate = "2026-05-20";

const readerReadySlugs = new Set([
  "best-mini-pc-for-proxmox-nas",
  "proxmox-mini-pc-buying-checklist",
  "n100-n305-homelab-buyer-guide",
  "proxmox-mini-pc-nas-checklist",
  "proxmox-storage-layout-beginners",
  "proxmox-passthrough-beginner-checklist",
  "hba-passthrough-truenas-vm",
  "minisforum-ms-01-proxmox",
  "intel-n100-proxmox-nas",
  "intel-n305-proxmox-homelab",
  "amd-ryzen-7840hs-proxmox",
  "beelink-eq13-proxmox",
  "proxmox-local-lvm-vs-directory",
  "proxmox-n100-vs-n305",
  "proxmox-zfs-mirror-mini-pc",
  "proxmox-vs-truenas-scale-mini-pc",
  "proxmox-mini-pc-vs-used-server",
  "proxmox-2-5g-i226-v",
  "proxmox-realtek-rtl8125",
  "proxmox-no-network-after-install",
  "proxmox-storage-layout-checklist",
  "aoostar-r1-proxmox-nas",
  "aoostar-r7-proxmox-nas",
  "cwwk-n100-proxmox-router",
  "dell-optiplex-micro-proxmox",
  "hp-elitedesk-mini-proxmox",
  "lenovo-thinkcentre-tiny-proxmox",
  "used-office-pc-proxmox",
  "proxmox-vlan-aware-bridge",
  "proxmox-vm-no-internet",
  "proxmox-nas-vm-disk-ownership",
  "proxmox-restore-test-checklist"
]);

const hubByType = {
  buyer_checklist: ["proxmox-mini-pc-buying-checklist", "best-mini-pc-for-proxmox-nas", "proxmox-storage-layout-beginners", "proxmox-restore-test-checklist"],
  hardware_fit: ["proxmox-mini-pc-buying-checklist", "best-mini-pc-for-proxmox-nas", "proxmox-mini-pc-vs-used-server", "proxmox-storage-layout-beginners"],
  networking_fit: ["proxmox-2-5g-i226-v", "proxmox-realtek-rtl8125", "proxmox-vlan-aware-bridge", "proxmox-no-network-after-install"],
  storage_fit: ["proxmox-storage-layout-beginners", "proxmox-storage-layout-checklist", "proxmox-local-lvm-vs-directory", "proxmox-zfs-mirror-mini-pc"],
  passthrough_fit: ["proxmox-passthrough-beginner-checklist", "hba-passthrough-truenas-vm", "proxmox-nas-vm-disk-ownership", "proxmox-storage-layout-beginners"],
  comparison: ["proxmox-mini-pc-buying-checklist", "best-mini-pc-for-proxmox-nas", "proxmox-storage-layout-beginners", "proxmox-mini-pc-vs-used-server"],
  error_fix: ["proxmox-no-network-after-install", "proxmox-vlan-aware-bridge", "proxmox-mini-pc-buying-checklist", "proxmox-restore-test-checklist"],
  ops_checklist: ["proxmox-restore-test-checklist", "proxmox-storage-layout-beginners", "proxmox-mini-pc-buying-checklist", "proxmox-power-loss-recovery"]
};

const scoresByType = {
  buyer_checklist: [
    ["Beginner friendliness", 5, "Useful because it turns a vague purchase into checks a beginner can actually verify."],
    ["Buying confidence", 4, "Strong when the exact hardware details are known before checkout."],
    ["Storage clarity", 3, "Good only after disk ownership and backup location are written down."],
    ["Network risk", 3, "Depends on the exact NIC and recovery access."],
    ["Upgrade flexibility", 3, "Mini PCs are efficient, but expansion is still the tradeoff."]
  ],
  hardware_fit: [
    ["Beginner friendliness", 4, "Good when used as a fit check instead of a promise that every SKU behaves the same."],
    ["Buying confidence", 3, "Improves only after the exact SKU, NIC, RAM, and storage layout are confirmed."],
    ["Storage flexibility", 3, "Often the first constraint in compact systems."],
    ["Network risk", 3, "Exact NIC model and switch path still need verification."],
    ["Long-term headroom", 3, "Fine for modest homelabs, weaker for broad expansion plans."]
  ],
  networking_fit: [
    ["Beginner friendliness", 3, "Manageable if console access and rollback are ready before changes."],
    ["Network risk", 4, "Worth treating as a first-class buying and migration decision."],
    ["Recovery clarity", 3, "Safe only when management access survives a bad bridge or link change."],
    ["Performance upside", 4, "Useful when the switch, cable, and workload can use it."],
    ["Troubleshooting effort", 3, "Driver, switch, VLAN, and bridge issues can look similar."]
  ],
  storage_fit: [
    ["Beginner friendliness", 3, "Friendly only when every disk has a named role."],
    ["Data safety", 4, "Good decisions here protect the whole homelab."],
    ["Recovery clarity", 4, "Backups and restore tests matter more than storage labels."],
    ["Upgrade flexibility", 3, "Depends on drive bays, ports, and whether ownership is clear."],
    ["Risk if rushed", 5, "Storage mistakes are expensive to undo."]
  ],
  passthrough_fit: [
    ["Beginner friendliness", 2, "Powerful, but not a good first shortcut."],
    ["Hardware dependency", 5, "IOMMU groups, firmware, and device ownership decide the outcome."],
    ["Recovery clarity", 3, "Safe only with rollback and host boot separation."],
    ["Performance upside", 4, "Useful when a VM genuinely needs direct device ownership."],
    ["Risk if rushed", 5, "Copying commands before mapping ownership can lock in a bad design."]
  ],
  comparison: [
    ["Beginner friendliness", 4, "Useful when it narrows the decision instead of listing every option."],
    ["Buying confidence", 4, "Stronger when the reader can map the comparison to their actual workload."],
    ["Storage clarity", 3, "Most comparisons still need a storage plan afterwards."],
    ["Network risk", 3, "NIC and switch details can change the conclusion."],
    ["Upgrade flexibility", 4, "Good for avoiding a purchase that traps the next step."]
  ],
  error_fix: [
    ["Beginner friendliness", 4, "Useful because it gives a safe order of operations."],
    ["Recovery clarity", 5, "Console access and rollback matter more than speed."],
    ["Network risk", 5, "A wrong bridge or interface can cut off access immediately."],
    ["Buying confidence", 2, "This is more troubleshooting than buying advice."],
    ["Time saved", 4, "A structured check prevents random config edits."]
  ],
  ops_checklist: [
    ["Beginner friendliness", 4, "Good because it turns operations into repeatable checks."],
    ["Recovery clarity", 5, "The whole page should make failure less scary."],
    ["Data safety", 5, "Backups and restore tests are the practical trust layer."],
    ["Buying confidence", 3, "Useful for deciding what reliability gear is actually needed."],
    ["Risk if skipped", 5, "Skipping operations work is how a lab becomes fragile."]
  ]
};

const extraSources = {
  "intel-n100-proxmox-nas": [
    { title: "Intel Processor N100 Specifications", url: "https://www.intel.com/content/www/us/en/products/sku/231803/intel-processor-n100-6m-cache-up-to-3-40-ghz/specifications.html", accessed_at: reviewDate }
  ],
  "intel-n305-proxmox-homelab": [
    { title: "Intel Core i3-N305 Processor Specifications", url: "https://www.intel.com/content/www/us/en/products/sku/231805/intel-core-i3n305-processor-6m-cache-up-to-3-80-ghz/specifications.html", accessed_at: reviewDate }
  ],
  "n100-n305-homelab-buyer-guide": [
    { title: "Intel Processor N100 Specifications", url: "https://www.intel.com/content/www/us/en/products/sku/231803/intel-processor-n100-6m-cache-up-to-3-40-ghz/specifications.html", accessed_at: reviewDate },
    { title: "Intel Core i3-N305 Processor Specifications", url: "https://www.intel.com/content/www/us/en/products/sku/231805/intel-core-i3n305-processor-6m-cache-up-to-3-80-ghz/specifications.html", accessed_at: reviewDate }
  ],
  "proxmox-vlan-aware-bridge": [
    { title: "Proxmox VE Network Configuration", url: "https://pve.proxmox.com/pve-docs/chapter-sysadmin.html#sysadmin_network_configuration", accessed_at: reviewDate }
  ],
  "proxmox-vm-no-internet": [
    { title: "Proxmox VE Network Configuration", url: "https://pve.proxmox.com/pve-docs/chapter-sysadmin.html#sysadmin_network_configuration", accessed_at: reviewDate }
  ],
  "proxmox-restore-test-checklist": [
    { title: "Proxmox Backup Server Documentation", url: "https://pbs.proxmox.com/docs/", accessed_at: reviewDate }
  ]
};

const specialCopy = {
  "intel-n305-proxmox-homelab": {
    summary: "Intel N305 is a good Proxmox homelab choice when you need more VM headroom than N100, but the exact mini PC still has to pass RAM, NIC, storage, cooling, and backup checks.",
    quick_answer: "Choose an N305 box for Proxmox only when the extra CPU headroom matches a written workload list. Do not pay for N305 if the same system still has unclear RAM, a vague NIC, weak cooling, or a cramped storage path.",
    verdict: {
      headline: "Buy N305 for workload margin, not as a shortcut around platform checks.",
      recommendation: "N305 makes sense for more simultaneous VMs and heavier services when the complete mini PC is well documented.",
      best_for: "More ambitious low-power homelabs, NAS plus services, and buyers who already know their VM count.",
      avoid_if: "You mainly need storage bays, a known NIC, or cheaper always-on efficiency.",
      biggest_risk: "Treating the CPU upgrade as if it solves RAM, storage, cooling, or backup limits."
    }
  },
  "amd-ryzen-7840hs-proxmox": {
    summary: "Ryzen 7840HS-class mini PCs can be strong Proxmox hosts for heavier workloads, but they should be bought for known CPU needs, not as a vague future-proofing bet.",
    quick_answer: "Consider Ryzen 7840HS when you expect CPU-heavy VMs, media tasks, or more headroom than Alder Lake-N. Still verify NIC, storage slots, cooling behavior, BIOS options, and backups before buying.",
    verdict: {
      headline: "Buy Ryzen headroom only when the workload will use it.",
      recommendation: "A Ryzen 7840HS mini PC can be a powerful Proxmox host, but it is not automatically a better NAS or safer beginner box.",
      best_for: "CPU-heavier labs, media workloads, and users who want more headroom in a small machine.",
      avoid_if: "You mainly need drive bays, low idle power, or the simplest first Proxmox host.",
      biggest_risk: "Paying for performance while storage, NIC, and cooling remain the actual constraints."
    }
  },
  "beelink-eq13-proxmox": {
    summary: "Beelink EQ13 can be a reasonable Proxmox candidate only after the exact SKU, NIC, RAM, storage, cooling, and BIOS access are confirmed.",
    quick_answer: "Treat Beelink EQ13 as a fit-check purchase: confirm the exact hardware revision, NIC model, RAM configuration, drive layout, and cooling expectations before trusting it with always-on services.",
    verdict: {
      headline: "Buy only after the exact EQ13 configuration is no longer vague.",
      recommendation: "The EQ13 path can work for light Proxmox use, but the listing details matter more than the brand name.",
      best_for: "Small always-on services, low-power labs, and buyers willing to verify the exact SKU.",
      avoid_if: "You need many drives, heavy VM headroom, or cannot confirm NIC and RAM details.",
      biggest_risk: "Assuming all EQ13 listings have the same homelab-friendly details."
    }
  },
  "proxmox-vlan-aware-bridge": {
    summary: "A Proxmox VLAN-aware bridge is useful when one host must carry multiple networks, but it should be configured only with console access, switch port clarity, and rollback notes.",
    quick_answer: "Use a VLAN-aware bridge when you can identify the physical interface, switch trunk/access behavior, management VLAN, and guest VLANs. Do not make the change remotely without a rollback path.",
    verdict: {
      headline: "Configure VLAN-aware bridging only when management access is protected.",
      recommendation: "It is a good fit for segmented homelabs, but only after the switch port, bridge name, and rollback path are written down.",
      best_for: "Labs with multiple VLANs, firewall VMs, and separated services.",
      avoid_if: "You have no console access or are unsure how the switch port is configured.",
      biggest_risk: "Locking yourself out by moving management traffic onto the wrong VLAN."
    }
  },
  "proxmox-vm-no-internet": {
    summary: "When a Proxmox VM has no internet, debug in order: host link, bridge mapping, VM NIC, gateway, DNS, firewall rules, and recent network changes.",
    quick_answer: "Start with the host and bridge before editing the guest. Confirm the Proxmox host has network access, the VM is attached to the intended bridge, the gateway is reachable, and DNS is not being mistaken for full network failure.",
    verdict: {
      headline: "Fix the path, not random settings.",
      recommendation: "Treat VM internet failure as a chain: physical NIC, Linux bridge, VM adapter, IP/gateway, DNS, and firewall.",
      best_for: "Single-node homelabs, fresh Proxmox installs, and bridge changes that broke guest access.",
      avoid_if: "The host itself has no network; fix host management first.",
      biggest_risk: "Changing multiple network layers at once and losing the known-good state."
    }
  },
  "proxmox-nas-vm-disk-ownership": {
    summary: "A NAS VM on Proxmox is safest when every disk has exactly one owner and Proxmox boot storage is separate from disks passed to the NAS VM.",
    quick_answer: "Before building a NAS VM, decide which disks Proxmox owns and which disks the NAS VM owns. If that ownership cannot be explained cleanly, use a simpler storage layout first.",
    verdict: {
      headline: "Do not build a NAS VM until disk ownership is obvious.",
      recommendation: "NAS VM designs can work well, but only when boot storage, VM storage, passed-through disks, backups, and restore paths are separate.",
      best_for: "Users who understand passthrough, recovery, and direct disk ownership.",
      avoid_if: "You are trying to share the same disks between Proxmox and the NAS VM without a clear owner.",
      biggest_risk: "Creating a storage dependency loop that makes recovery confusing."
    }
  },
  "proxmox-restore-test-checklist": {
    summary: "A Proxmox backup is only trustworthy after a restore test proves that the VM, data, network identity, and recovery notes actually work.",
    quick_answer: "Run a restore test before important data depends on the host. A backup file is not enough; verify that you can boot or inspect the restored workload and that the recovery path is documented.",
    verdict: {
      headline: "A backup becomes real only after restore testing.",
      recommendation: "Make restore testing a normal homelab habit before updates, storage changes, and important service migrations.",
      best_for: "Users storing important files, running Home Assistant, or depending on always-on services.",
      avoid_if: "You are only looking for a purchase recommendation; start with the build checklist first.",
      biggest_risk: "Discovering during an outage that backups exist but cannot restore the thing you care about."
    }
  }
};

function uniqueSources(existing, additions = []) {
  const seen = new Set();
  return [...existing, ...additions].filter((source) => {
    if (!source?.url || seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

function titleFor(page) {
  return page.h1 || page.seo_title?.replace(" | Homelab Fit", "") || "this Proxmox decision";
}

function typeNoun(type) {
  return {
    buyer_checklist: "buying decision",
    hardware_fit: "hardware fit",
    networking_fit: "network design",
    storage_fit: "storage plan",
    passthrough_fit: "passthrough design",
    comparison: "architecture choice",
    error_fix: "troubleshooting path",
    ops_checklist: "operations habit"
  }[type] || "homelab decision";
}

function fallbackVerdict(slug, page) {
  const title = titleFor(page);
  const noun = typeNoun(page.intent_type);
  return {
    label: "Reader verdict",
    headline: `Use ${title} as a ${noun} check, not a shortcut.`,
    recommendation: `This page is worth reading when ${page.applies_to?.[0] || "your Proxmox setup"} is part of the plan and you need a clear risk check before buying or changing the host.`,
    best_for: (page.best_for || ["Proxmox homelab builders"]).slice(0, 2).join(", "),
    avoid_if: (page.not_for || ["the exact hardware or recovery path is unknown"]).slice(0, 2).join(", "),
    biggest_risk: (page.warnings || ["Moving ahead before the failure mode is understood."])[0]
  };
}

function fallbackScenarios(slug, page) {
  const title = titleFor(page);
  const hubs = (hubByType[page.intent_type] || hubByType.buyer_checklist).filter((item) => item !== slug);
  return [
    {
      situation: "I am buying before I build",
      path: `Use ${title} to decide what must be verified before checkout.`,
      why: "The safest purchase is the one with fewer unknowns after the checklist, not the one with the best headline spec.",
      href: `/wiki/${hubs[0]}/`
    },
    {
      situation: "I already own the hardware",
      path: "Turn the page into a validation checklist before migrating workloads.",
      why: "Existing hardware can still be a good fit if storage, network, backup, and rollback are clear.",
      href: `/wiki/${hubs[1]}/`
    },
    {
      situation: "I hit a risk warning",
      path: "Follow the next page that matches the risk instead of forcing the original plan.",
      why: "A good homelab decision changes shape when the risky detail becomes visible.",
      href: `/wiki/${hubs[2]}/`
    }
  ];
}

function fallbackSafeDefault(page) {
  return {
    title: "Beginner-safe default",
    body: "Choose the boring path first: known hardware details, one clear storage owner, console access for network changes, and a backup target outside the host.",
    checks: [
      "Exact SKU, NIC, and storage layout are recorded",
      "Rollback or restore path exists before the change",
      "The next step is small enough to test"
    ]
  };
}

function fallbackUpgradePath(page) {
  return [
    "Start with the simplest design that satisfies the current workload.",
    "Add complexity only after backups, restore tests, and network access are proven.",
    "Move to the next hardware or architecture class when the current constraint is measured, not guessed."
  ];
}

function fallbackDecisionMatrix(page) {
  return {
    title: "How to decide",
    headers: ["If this is true", "Safer path", "Pause when"],
    rows: [
      ["The exact hardware details are known", "Continue with the checklist", "NIC, RAM, or storage details are missing"],
      ["The setup will hold important data", "Plan backup and restore first", "Redundancy is being treated as backup"],
      ["The design needs passthrough or VLANs", "Document rollback before changing", "You have no local console access"],
      ["The goal is a first homelab", "Keep the first version boring", "The plan depends on too many untested assumptions"]
    ]
  };
}

function fallbackSaveableSummary(page) {
  return {
    title: "Save this before acting",
    items: [
      "Exact hardware details matter more than the product family name.",
      "Backups and rollback should exist before important changes.",
      "Unknown NIC, storage, or passthrough details are buying blockers.",
      "A simpler first build is usually easier to trust."
    ]
  };
}

function fallbackFaq(page) {
  const title = titleFor(page);
  return [
    [`Is ${title} beginner-friendly?`, "It can be, if you treat it as a checklist and verify the exact hardware, storage, network, and backup details before depending on it."],
    ["What should I verify first?", "Start with the exact SKU or configuration, then check NIC, RAM, storage ownership, cooling, backups, and rollback."],
    ["What is the main trap?", "Moving forward because the category sounds right while the exact failure mode is still unknown."],
    ["When should I pause?", "Pause when the plan depends on unknown NIC behavior, unclear disk ownership, no backup target, or no way to recover from a bad change."],
    ["What should I read next?", "Follow the reading path at the bottom of the page based on the first risk you found."]
  ];
}

function fallbackReadingPath(slug, page) {
  return (hubByType[page.intent_type] || hubByType.buyer_checklist)
    .filter((item) => item !== slug && content[item])
    .slice(0, 4)
    .map((item) => ({
      slug: item,
      label: content[item]?.h1 || item.replaceAll("-", " "),
      reason: "Use this next when this page exposes a related buying, storage, network, or recovery risk."
    }));
}

for (const [slug, page] of Object.entries(content)) {
  const isReady = readerReadySlugs.has(slug);
  page.status = isReady ? "reader_ready" : "supporting_draft";
  page.indexable = isReady;

  if (!isReady) {
    page.reader_note = "Supporting draft kept for internal linking and future refinement; not promoted for search until it has a stronger verdict and decision path.";
    continue;
  }

  const special = specialCopy[slug] || {};
  Object.assign(page, {
    updated_at: reviewDate,
    last_reviewed: reviewDate,
    summary: special.summary || page.summary,
    quick_answer: special.quick_answer || page.quick_answer || page.summary,
    verdict: special.verdict ? { label: "Reader verdict", ...special.verdict } : page.verdict || fallbackVerdict(slug, page),
    buyer_scenarios: page.buyer_scenarios || fallbackScenarios(slug, page),
    safe_default: page.safe_default || fallbackSafeDefault(page),
    upgrade_path: page.upgrade_path || fallbackUpgradePath(page),
    decision_scores: page.decision_scores || scoresByType[page.intent_type] || scoresByType.buyer_checklist,
    decision_matrix: page.decision_matrix || fallbackDecisionMatrix(page),
    saveable_summary: page.saveable_summary || fallbackSaveableSummary(page),
    faq: page.faq && page.faq.length >= 5 ? page.faq : fallbackFaq(page),
    reading_path: page.reading_path && page.reading_path.length >= 3 ? page.reading_path : fallbackReadingPath(slug, page),
    sources: uniqueSources(page.sources || [], extraSources[slug] || [])
  });

  if (!page.editorial_intro) {
    page.editorial_intro = `${titleFor(page)} should help you make a calmer decision. The point is not to make the homelab more complicated; it is to reveal the first thing that could make the build annoying, fragile, or hard to recover.`;
  }
}

writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`);

const readyCount = Object.values(content).filter((page) => page.status === "reader_ready").length;
const supportCount = Object.values(content).filter((page) => page.status === "supporting_draft").length;
console.log(`Reader-ready pages: ${readyCount}`);
console.log(`Supporting drafts: ${supportCount}`);
