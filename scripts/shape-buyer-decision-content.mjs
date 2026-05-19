import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const contentPath = resolve("data/homelab-page-content.json");
const generatedPath = resolve("data/homelab-generated-page-ideas.csv");
const content = JSON.parse(readFileSync(contentPath, "utf8"));
const generatedCsv = readFileSync(generatedPath, "utf8");
const reviewDate = "2026-05-19";

const pillarRows = [
  "best-mini-pc-for-proxmox-nas,Best Mini PC For Proxmox NAS,buyer_checklist,best mini pc for proxmox nas,choose a mini PC for a Proxmox NAS,Proxmox VE mini PC NAS buyers,5,https://www.proxmox.com/en/proxmox-ve/requirements,buyer guide,Primary pillar for NAS buyers",
  "proxmox-mini-pc-buying-checklist,Proxmox Mini PC Buying Checklist,buyer_checklist,proxmox mini pc buying checklist,buy a mini PC for Proxmox without missing hardware risks,Proxmox VE mini PC buyers,5,https://www.proxmox.com/en/proxmox-ve/requirements,buyer guide,Primary pillar for pre-buy checks",
  "n100-n305-homelab-buyer-guide,N100/N305 Homelab Buyer Guide,comparison,n100 n305 homelab buyer guide,choose between N100 and N305 mini PCs for homelab use,Intel N100 Intel N305 Proxmox buyers,5,https://www.proxmox.com/en/proxmox-ve/requirements,buyer guide,Primary pillar for Alder Lake-N buyers",
  "proxmox-storage-layout-beginners,Proxmox Storage Layout For Beginners,storage_fit,proxmox storage layout beginners,choose a beginner-friendly Proxmox storage layout,Proxmox VE storage beginners,5,https://pve.proxmox.com/pve-docs/chapter-storage.html,storage guide,Primary pillar for storage beginners",
  "proxmox-passthrough-beginner-checklist,Proxmox Passthrough Beginner Checklist,passthrough_fit,proxmox passthrough beginner checklist,decide whether passthrough is worth the risk,Proxmox VE passthrough beginners,5,https://pve.proxmox.com/wiki/PCI%28e%29_Passthrough,passthrough guide,Primary pillar for passthrough beginners"
];

for (const row of pillarRows) {
  const slug = row.split(",")[0];
  if (!generatedCsv.includes(`${slug},`)) {
    writeFileSync(generatedPath, `${generatedCsv.trimEnd()}\n${pillarRows.filter((candidate) => !generatedCsv.includes(`${candidate.split(",")[0]},`)).join("\n")}\n`);
    break;
  }
}

const pillarContent = {
  "best-mini-pc-for-proxmox-nas": {
    status: "publishable_draft",
    updated_at: reviewDate,
    summary: "The best mini PC for a Proxmox NAS is the one with a boring storage path, a known NIC, enough RAM, and an off-box backup plan; CPU choice comes after those checks.",
    quick_answer: "Buy the mini PC that makes storage, networking, and recovery simple. For most beginners, that means choosing a quiet low-power box only after the drive layout, NIC model, RAM ceiling, and backup target are written down.",
    applies_to: ["Proxmox VE", "mini PC NAS buyers", "first homelab"],
    intent_type: "buyer_checklist",
    opportunity_score: 94,
    facts: [
      ["Best starting point", "Start with storage ownership, drive count, NIC model, RAM ceiling, and backup target before comparing CPU benchmarks."],
      ["Beginner fit", "A simple N100 or N305-class host can work well when the NAS role is modest and backups are off-box."],
      ["Main trap", "A quiet mini PC can still be a poor NAS if it has no comfortable path for disks or recovery."],
      ["Decision rule", "Prefer the system whose failure modes you can understand, test, and reverse."]
    ],
    steps: [
      "Write down whether the NAS data lives inside Proxmox, in a NAS VM, or on an external NAS.",
      "Confirm the exact NIC model, not just the advertised port speed.",
      "Check RAM capacity, replaceability, and expected VM/container load.",
      "Decide which disks hold boot, VM data, NAS data, and backups.",
      "Run the final choice through the mini PC NAS checklist before buying."
    ],
    warnings: [
      "Do not buy a mini PC NAS because the CPU looks efficient while ignoring drive count.",
      "Do not treat a mirror, RAID, or ZFS pool as a backup."
    ],
    verification: [
      "The chosen host has a written storage ownership plan.",
      "The backup destination is outside the same mini PC.",
      "The NIC and switch path can be tested at the expected speed."
    ],
    best_for: ["Quiet first Proxmox NAS builds", "Buyers comparing N100, N305, and workstation-style mini PCs", "Small homeserver workloads"],
    not_for: ["Large drive arrays", "Enterprise HA expectations", "Users who need vendor-supported NAS appliance behavior"],
    common_mistakes: ["Buying by CPU benchmark", "Trusting USB storage for important data without a recovery plan", "Skipping restore tests"],
    examples: [{ title: "Mini PC NAS pre-buy scorecard", code: "Storage ownership:\nNIC model:\nRAM ceiling:\nDrive layout:\nBackup target:\nRestore test plan:" }],
    faq: [
      ["Is an N100 enough for a Proxmox NAS?", "Often yes for a small homelab, but storage layout, RAM, NIC stability, and backups decide the fit."],
      ["Should beginners use a NAS VM?", "Only when disk ownership and passthrough are clear. Simple Proxmox-managed storage can be better for a first build."]
    ],
    related_slugs: ["proxmox-mini-pc-nas-checklist", "intel-n100-proxmox-nas", "proxmox-zfs-mirror-mini-pc"],
    seo_title: "Best Mini PC For Proxmox NAS | Homelab Fit",
    h1: "Best Mini PC For Proxmox NAS",
    meta_description: "Choose a mini PC for a Proxmox NAS by checking storage ownership, NIC model, RAM, ZFS, backups, passthrough, and recovery risk before buying.",
    sources: [
      { title: "Proxmox VE System Requirements", url: "https://www.proxmox.com/en/proxmox-ve/requirements", accessed_at: reviewDate },
      { title: "Proxmox VE Storage Documentation", url: "https://pve.proxmox.com/pve-docs/chapter-storage.html", accessed_at: reviewDate }
    ],
    related_path_seed: ["proxmox-mini-pc-nas-checklist", "intel-n100-proxmox-nas", "proxmox-vs-truenas-scale-mini-pc"]
  },
  "proxmox-mini-pc-buying-checklist": {
    status: "publishable_draft",
    updated_at: reviewDate,
    summary: "A Proxmox mini PC buying checklist should cover CPU virtualization, RAM ceiling, NIC model, storage slots, cooling, noise, BIOS options, and backup recovery before price.",
    quick_answer: "Use the checklist before comparing deals: exact NIC, RAM ceiling, storage slots, cooling, and backup path matter more than a pretty product page.",
    applies_to: ["Proxmox VE", "mini PC buyers", "hardware pre-buy checks"],
    intent_type: "buyer_checklist",
    opportunity_score: 93,
    facts: [
      ["First check", "Confirm the exact hardware revision and NIC before buying."],
      ["Storage check", "Count real internal storage options and write down what each disk will do."],
      ["Noise check", "A compact box is only useful if it can live where it will actually run."],
      ["Recovery check", "The backup target should not be the same mini PC."]
    ],
    steps: [
      "Confirm CPU virtualization support and BIOS access.",
      "Check RAM ceiling and whether memory is replaceable.",
      "Identify the exact NIC model and expected switch speed.",
      "Map boot, VM, NAS, and backup storage before buying.",
      "Read at least one hardware-fit page for the exact class of system."
    ],
    warnings: ["Avoid listings that hide the NIC model or RAM configuration.", "Do not buy a tiny box for a storage-heavy plan without drive math."],
    verification: ["A pre-buy scorecard is filled out.", "The chosen model has a clear storage and backup plan.", "The next article in the reading path matches the intended use."],
    best_for: ["First-time Proxmox buyers", "Low-power homelabs", "Mini PC NAS planning"],
    not_for: ["Enterprise procurement", "Large rack storage builds", "Users who already have fixed hardware"],
    common_mistakes: ["Buying the cheapest SKU", "Ignoring BIOS options", "Assuming every 2.5G NIC behaves the same"],
    examples: [{ title: "Buying checklist", code: "CPU:\nRAM ceiling:\nNIC model:\nInternal storage:\nNoise/cooling:\nBackup target:\nFallback plan:" }],
    faq: [["What matters most?", "RAM, storage, NIC, cooling, and recovery usually matter more than the CPU name for beginners."], ["Should I buy used?", "Used office PCs can be excellent if power, noise, drive layout, and NIC needs fit your space."]],
    related_slugs: ["best-mini-pc-for-proxmox-nas", "used-office-pc-proxmox", "proxmox-mini-pc-vs-used-server"],
    seo_title: "Proxmox Mini PC Buying Checklist | Homelab Fit",
    h1: "Proxmox Mini PC Buying Checklist",
    meta_description: "Use this Proxmox mini PC buying checklist to verify CPU, RAM, NIC, storage, cooling, BIOS, backups, and recovery before purchasing hardware.",
    sources: [
      { title: "Proxmox VE System Requirements", url: "https://www.proxmox.com/en/proxmox-ve/requirements", accessed_at: reviewDate },
      { title: "Proxmox VE Administration Guide", url: "https://pve.proxmox.com/pve-docs/", accessed_at: reviewDate }
    ],
    related_path_seed: ["best-mini-pc-for-proxmox-nas", "proxmox-mini-pc-vs-used-server", "proxmox-storage-layout-beginners"]
  },
  "n100-n305-homelab-buyer-guide": {
    status: "publishable_draft",
    updated_at: reviewDate,
    summary: "For a beginner homelab, Intel N100 is usually the value and efficiency choice while N305 buys more CPU headroom; the full mini PC platform still decides the better purchase.",
    quick_answer: "Choose N100 when the plan is quiet, cheap, and known. Choose N305 when the price gap is small and you expect more simultaneous VMs, but do not let the CPU distract from RAM, NIC, storage, or cooling.",
    applies_to: ["Intel N100", "Intel N305", "Proxmox VE buyers"],
    intent_type: "comparison",
    opportunity_score: 93,
    facts: [
      ["Value choice", "N100 is usually the low-cost efficient baseline."],
      ["Headroom choice", "N305 is more attractive when the workload is VM-heavy or the price gap is small."],
      ["Platform rule", "RAM, NIC, storage, and cooling can make either CPU the wrong buy."],
      ["Beginner rule", "Buy for known workloads, not vague future expansion."]
    ],
    steps: ["List expected VMs and containers.", "Set a RAM target before picking CPU.", "Check NIC and storage layout on the exact mini PC.", "Decide whether the host will also be a NAS or firewall.", "Compare complete systems, not CPU names."],
    warnings: ["N305 does not fix a cramped storage layout.", "N100 can feel limiting if you buy it for unknown future workloads."],
    verification: ["The chosen CPU matches a written workload list.", "The system has enough RAM and storage for the plan.", "Cooling can sustain the intended workload."],
    best_for: ["Alder Lake-N mini PC buyers", "Low-power homelab comparisons", "Budget-sensitive Proxmox planning"],
    not_for: ["Large VM farms", "Heavy PCIe expansion needs", "Users comparing full used servers"],
    common_mistakes: ["Treating CPU as the whole decision", "Ignoring RAM limits", "Buying headroom while skipping backups"],
    examples: [{ title: "N100/N305 choice", code: "Known light services: N100 likely\nMore VMs expected: N305 likely\nNAS-heavy build: storage first\nFirewall build: NIC first" }],
    faq: [["Is N305 always better?", "No. It can be better for headroom, but N100 can be the better value when workloads are modest."], ["Is N100 enough for Proxmox?", "Often yes for containers, light VMs, and small services when RAM and storage are planned."]],
    related_slugs: ["proxmox-n100-vs-n305", "intel-n100-proxmox-nas", "intel-n305-proxmox-homelab"],
    seo_title: "N100/N305 Homelab Buyer Guide | Homelab Fit",
    h1: "N100/N305 Homelab Buyer Guide",
    meta_description: "Choose between Intel N100 and N305 mini PCs for Proxmox by comparing workload headroom, RAM, NICs, storage, cooling, and NAS use.",
    sources: [
      { title: "Proxmox VE System Requirements", url: "https://www.proxmox.com/en/proxmox-ve/requirements", accessed_at: reviewDate },
      { title: "Proxmox VE Administration Guide", url: "https://pve.proxmox.com/pve-docs/", accessed_at: reviewDate }
    ],
    related_path_seed: ["proxmox-n100-vs-n305", "intel-n100-proxmox-nas", "proxmox-mini-pc-buying-checklist"]
  },
  "proxmox-storage-layout-beginners": {
    status: "publishable_draft",
    updated_at: reviewDate,
    summary: "A beginner-friendly Proxmox storage layout separates boot, VM disks, ISO/template storage, NAS data, and backups so each role is easy to inspect and recover.",
    quick_answer: "Start with roles, not formats. Decide where boot, VM disks, ISOs, NAS data, and backups belong before choosing local-lvm, directory storage, ZFS, or passthrough.",
    applies_to: ["Proxmox VE", "storage beginners", "mini PC NAS"],
    intent_type: "storage_fit",
    opportunity_score: 92,
    facts: [
      ["Core idea", "Storage roles should be named before storage formats are chosen."],
      ["Beginner risk", "Mixing VM disks, backups, ISOs, and NAS files into one vague pool makes recovery harder."],
      ["ZFS caveat", "ZFS can be excellent, but it still needs drive count, backups, and restore testing."],
      ["Backup rule", "A redundant pool is not a backup."]
    ],
    steps: ["List every storage role.", "Choose Proxmox-managed storage or NAS VM ownership.", "Keep backups off the same host.", "Prefer simple layouts for a first build.", "Run a restore test before trusting important data."],
    warnings: ["Do not pass through disks Proxmox still depends on.", "Do not fill the only boot disk with everything."],
    verification: ["Each disk has one clear owner.", "Backups are stored outside the same host.", "A restore test has been run."],
    best_for: ["First Proxmox storage plans", "Mini PC NAS buyers", "Users choosing local-lvm, directory, or ZFS"],
    not_for: ["Enterprise SAN design", "Large Ceph clusters", "Users who already have a documented storage policy"],
    common_mistakes: ["Choosing ZFS before counting drives", "Treating local-lvm like a folder", "Keeping backups beside the data"],
    examples: [{ title: "Beginner storage map", code: "Boot:\nVM disks:\nISOs/templates:\nNAS data:\nBackups:\nRestore test date:" }],
    faq: [["Should beginners use ZFS?", "ZFS can be a good fit when drive count, RAM, backup, and recovery expectations are clear."], ["What is the safest first layout?", "The safest layout is usually the one you can explain and restore, not the most advanced one."]],
    related_slugs: ["proxmox-storage-layout-checklist", "proxmox-local-lvm-vs-directory", "proxmox-zfs-mirror-mini-pc"],
    seo_title: "Proxmox Storage Layout For Beginners | Homelab Fit",
    h1: "Proxmox Storage Layout For Beginners",
    meta_description: "Plan a beginner-friendly Proxmox storage layout across boot, VM disks, ISO storage, NAS data, ZFS, local-lvm, directory storage, and backups.",
    sources: [
      { title: "Proxmox VE Storage Documentation", url: "https://pve.proxmox.com/pve-docs/chapter-storage.html", accessed_at: reviewDate },
      { title: "Proxmox VE Installation Documentation", url: "https://pve.proxmox.com/pve-docs/chapter-pve-installation.html", accessed_at: reviewDate }
    ],
    related_path_seed: ["proxmox-local-lvm-vs-directory", "proxmox-zfs-mirror-mini-pc", "proxmox-nas-vm-disk-ownership"]
  },
  "proxmox-passthrough-beginner-checklist": {
    status: "publishable_draft",
    updated_at: reviewDate,
    summary: "Proxmox passthrough is worth considering only when the hardware supports clean isolation, the device owner is obvious, and the host can recover if the VM or device fails.",
    quick_answer: "Do passthrough only after you can name the device owner, IOMMU group, rollback path, and backup plan. If those are fuzzy, keep the first build simpler.",
    applies_to: ["Proxmox VE", "PCIe passthrough", "USB passthrough", "beginners"],
    intent_type: "passthrough_fit",
    opportunity_score: 92,
    facts: [
      ["Core dependency", "Passthrough depends on CPU, motherboard, firmware, IOMMU groups, and Proxmox configuration."],
      ["Ownership rule", "Only one system should own a passed-through storage controller or device path."],
      ["Beginner risk", "A copy-pasted passthrough command can create a recovery problem."],
      ["Safe path", "Test passthrough on non-critical devices before trusting storage."]
    ],
    steps: ["Confirm IOMMU support.", "Check device grouping before buying around passthrough.", "Keep host boot and management separate.", "Write rollback steps.", "Test reboot and restore behavior."],
    warnings: ["Do not pass through the device the host needs to boot.", "Avoid passthrough for a first NAS unless recovery is clear."],
    verification: ["The device appears only where expected.", "The host still boots without the VM.", "Rollback steps have been tested."],
    best_for: ["HBA passthrough planning", "GPU or Coral passthrough checks", "Home Assistant USB device planning"],
    not_for: ["First builds seeking the simplest storage path", "Hosts without IOMMU isolation", "Users without local console access"],
    common_mistakes: ["Skipping IOMMU group checks", "Passing storage without separating boot", "Assuming passthrough is automatically safer"],
    examples: [{ title: "Passthrough readiness card", code: "Device:\nIOMMU group:\nHost dependency:\nVM owner:\nRollback:\nRestore test:" }],
    faq: [["Should beginners use passthrough?", "Sometimes, but only when isolation and recovery are clear."], ["Is HBA passthrough required for TrueNAS?", "It is common for direct disk ownership, but the whole storage and recovery design matters."]],
    related_slugs: ["hba-passthrough-truenas-vm", "gpu-passthrough-checklist", "usb-passthrough-home-assistant"],
    seo_title: "Proxmox Passthrough Beginner Checklist | Homelab Fit",
    h1: "Proxmox Passthrough Beginner Checklist",
    meta_description: "Use this Proxmox passthrough beginner checklist to verify IOMMU, device ownership, HBA, GPU, USB, boot separation, and recovery risk.",
    sources: [
      { title: "Proxmox PCI(e) Passthrough Wiki", url: "https://pve.proxmox.com/wiki/PCI%28e%29_Passthrough", accessed_at: reviewDate },
      { title: "Proxmox VE Administration Guide", url: "https://pve.proxmox.com/pve-docs/", accessed_at: reviewDate }
    ],
    related_path_seed: ["hba-passthrough-truenas-vm", "gpu-passthrough-checklist", "usb-passthrough-home-assistant"]
  }
};

const topTwenty = [
  "proxmox-mini-pc-nas-checklist",
  "minisforum-ms-01-proxmox",
  "hba-passthrough-truenas-vm",
  "intel-n100-proxmox-nas",
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
  "used-office-pc-proxmox"
];

const scoreByType = {
  buyer_checklist: [
    ["Power", 4, "Usually friendly when the workload is written down first."],
    ["Noise", 4, "Mini PC paths can stay living-room friendly."],
    ["Storage flexibility", 3, "Good only when the drive plan is explicit."],
    ["Network risk", 3, "Exact NIC and switch behavior still need checking."],
    ["Beginner friendliness", 5, "Best entry point when used as a pre-buy checklist."]
  ],
  hardware_fit: [
    ["Power", 4, "Efficient if the SKU matches the workload."],
    ["Noise", 4, "Compact systems are usually quiet, but thermals must be tested."],
    ["Storage flexibility", 3, "Depends on the exact M.2, SATA, and external storage plan."],
    ["Network risk", 3, "Do not buy without confirming the NIC model."],
    ["Beginner friendliness", 4, "Good when the hardware role is narrow and documented."]
  ],
  passthrough_fit: [
    ["Power", 3, "Power depends on the device being passed through."],
    ["Noise", 3, "The passthrough device can change cooling and placement needs."],
    ["Storage flexibility", 5, "Strong when controller ownership is clean."],
    ["Network risk", 2, "Recovery risk rises if the host depends on the device."],
    ["Beginner friendliness", 2, "Use only with a rollback plan."]
  ],
  comparison: [
    ["Power", 3, "The right answer depends on the system chosen."],
    ["Noise", 3, "Compare where the machine will actually live."],
    ["Storage flexibility", 3, "The full platform matters more than the headline spec."],
    ["Network risk", 3, "NIC and bridge details can decide the winner."],
    ["Beginner friendliness", 4, "Useful when it leads to a simpler first build."]
  ],
  storage_fit: [
    ["Power", 3, "Storage choices can change idle and sustained behavior."],
    ["Noise", 3, "Drive count and cooling affect placement."],
    ["Storage flexibility", 5, "This is the main reason to plan the page carefully."],
    ["Network risk", 3, "NAS use still depends on the transfer path."],
    ["Beginner friendliness", 3, "Friendly only when ownership and backups are explicit."]
  ],
  networking_fit: [
    ["Power", 4, "NIC choice is usually not the power bottleneck."],
    ["Noise", 4, "Networking checks rarely change placement."],
    ["Storage flexibility", 2, "Not a storage decision."],
    ["Network risk", 5, "This is the main thing to validate."],
    ["Beginner friendliness", 3, "Friendly if link, bridge, and switch checks are concrete."]
  ],
  error_fix: [
    ["Power", 3, "Not usually affected."],
    ["Noise", 3, "Not usually affected."],
    ["Storage flexibility", 2, "Only relevant when storage depends on networking."],
    ["Network risk", 5, "Make changes with local console access."],
    ["Beginner friendliness", 4, "Good if solved step by step."]
  ],
  ops_checklist: [
    ["Power", 3, "Operations should fit the always-on plan."],
    ["Noise", 3, "Maintenance plans should match where the host lives."],
    ["Storage flexibility", 4, "Backups and restore tests decide resilience."],
    ["Network risk", 4, "Remote changes need rollback notes."],
    ["Beginner friendliness", 4, "Checklists are easier than memory."]
  ]
};

function titleForSlug(slug) {
  return content[slug]?.h1 ?? slug.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

function typeFromContent(item) {
  return item.intent_type ?? "buyer_checklist";
}

function readableType(type) {
  return type.replaceAll("_", " ");
}

function buildDecisionFields(slug, item) {
  const type = typeFromContent(item);
  const primaryRisk = item.warnings?.[0] ?? "The build can fail in boring details that are easy to miss before purchase.";
  const bestFor = item.best_for?.[0] ?? "Beginners comparing Proxmox homelab options";
  const avoid = item.not_for?.[0] ?? "Users who cannot verify hardware and recovery details";
  const checks = item.steps?.slice(0, 3) ?? [];
  const related = item.related_slugs?.filter((candidate) => candidate !== slug).slice(0, 3) ?? [];
  const reading = [...new Set([...(item.related_path_seed ?? []), ...related])].filter((candidate) => candidate !== slug).slice(0, 4);

  const hardwareBaseTitle = item.seo_title?.split(" | ")[0] ?? titleForSlug(slug);
  const hardwareName = hardwareBaseTitle
    .replace(/ Proxmox Fit/g, "")
    .replace(/ Compatibility/g, "")
    .replace(/ Fit$/g, "")
    .replace(/ Proxmox NAS/g, " For a Proxmox NAS")
    .replace(/ Proxmox Router/g, " For a Proxmox Router");
  const hardwareTitle = type === "hardware_fit"
    ? `Should You Buy ${hardwareName} For Proxmox?`.replace("For a Proxmox NAS For Proxmox", "For a Proxmox NAS").replace("For a Proxmox Router For Proxmox", "For a Proxmox Router")
    : item.h1;

  return {
    ...item,
    h1: hardwareTitle,
    last_reviewed: item.last_reviewed ?? reviewDate,
    quick_answer: item.quick_answer ?? `${item.summary} Before buying or changing the build, verify the risks below instead of trusting the headline spec.`,
    verdict: item.verdict ?? {
      label: "Buyer verdict",
      headline: type === "hardware_fit" ? "Buy only if the exact SKU passes the checklist." : "Use this as a decision checkpoint before spending money.",
      recommendation: item.summary,
      best_for: bestFor,
      avoid_if: avoid,
      biggest_risk: primaryRisk
    },
    top_risks: item.top_risks ?? item.warnings?.slice(0, 3) ?? [primaryRisk],
    pre_buy_checks: item.pre_buy_checks ?? (checks.length >= 3 ? checks : [...checks, "Write down the backup and rollback plan before committing."].slice(0, 3)),
    decision_scores: item.decision_scores ?? scoreByType[type] ?? scoreByType.buyer_checklist,
    beginner_traps: item.beginner_traps ?? item.common_mistakes?.slice(0, 4) ?? ["Buying by spec sheet", "Skipping recovery planning"],
    reading_path: reading.map((candidate) => ({
      slug: candidate,
      label: titleForSlug(candidate),
      reason: `Next step for this ${readableType(type)} decision.`
    }))
  };
}

for (const [slug, item] of Object.entries(pillarContent)) {
  content[slug] = buildDecisionFields(slug, {
    ...item,
    image_alt: item.image_alt ?? `${item.h1} decision map`,
    image_caption: item.image_caption ?? "Start with the boring constraints: storage, networking, recovery, and where the machine will actually live.",
    editorial_intro: item.editorial_intro ?? "Most beginners do not need more specs. They need a route through the purchase: what to check first, what to avoid, and what page to read next when a risk shows up.",
    decision_table: item.decision_table ?? {
      title: "Beginner decision grid",
      headers: ["Question", "Good sign", "Risk signal"],
      rows: [
        ["Can you explain the role?", "The workload and storage owner are written down", "The box is being bought for vague future use"],
        ["Can you recover?", "Backups and rollback live outside the host", "Redundancy is treated as the backup"],
        ["Can you test it?", "NIC, storage, and restore checks are concrete", "The plan depends on assumptions from a product page"]
      ]
    },
    field_notes: item.field_notes ?? {
      eyebrow: "Start here",
      title: "A good homelab purchase should feel boring before it feels powerful.",
      body: "The goal is not to buy the most interesting box. It is to buy the simplest machine that survives the job you actually need it to do."
    }
  });
}

for (const slug of topTwenty) {
  if (!content[slug]) {
    throw new Error(`Missing top page content for ${slug}`);
  }
  content[slug] = buildDecisionFields(slug, content[slug]);
}

writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Enhanced ${topTwenty.length} top pages and ${Object.keys(pillarContent).length} pillar guides.`);
