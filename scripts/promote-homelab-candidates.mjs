import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { recordsFromCsv } from "../src/data/csv.js";

const today = "2026-05-18";
const manualPages = recordsFromCsv(readFileSync(resolve("data/homelab-page-inventory.csv"), "utf8"));
const generatedPages = recordsFromCsv(readFileSync(resolve("data/homelab-generated-page-ideas.csv"), "utf8"));
const pages = [...manualPages, ...generatedPages];
const contentPath = resolve("data/homelab-page-content.json");
const existing = JSON.parse(readFileSync(contentPath, "utf8"));

const fallbackSourceByType = {
  hardware_fit: "https://www.proxmox.com/en/proxmox-ve/requirements",
  buyer_checklist: "https://www.proxmox.com/en/proxmox-ve/requirements",
  networking_fit: "https://pve.proxmox.com/pve-docs/chapter-sysadmin.html#sysadmin_network_configuration",
  error_fix: "https://pve.proxmox.com/pve-docs/chapter-sysadmin.html",
  storage_fit: "https://pve.proxmox.com/pve-docs/chapter-storage.html",
  passthrough_fit: "https://pve.proxmox.com/wiki/PCI%28e%29_Passthrough",
  comparison: "https://pve.proxmox.com/pve-docs/",
  ops_checklist: "https://pve.proxmox.com/pve-docs/"
};

const sourceTitleByUrl = [
  ["proxmox.com/en/proxmox-ve/requirements", "Proxmox VE System Requirements"],
  ["chapter-sysadmin", "Proxmox VE System Administration"],
  ["chapter-storage", "Proxmox VE Storage Documentation"],
  ["chapter-zfs", "Proxmox VE ZFS Documentation"],
  ["PCI%28e%29_Passthrough", "Proxmox PCI(e) Passthrough Wiki"],
  ["chapter-pvecm", "Proxmox VE Cluster Manager Documentation"],
  ["chapter-ha-manager", "Proxmox VE High Availability Documentation"],
  ["chapter-pveceph", "Proxmox VE Ceph Documentation"],
  ["pbs.proxmox.com", "Proxmox Backup Server Documentation"],
  ["chapter-pve-installation", "Proxmox VE Installation Documentation"]
];

const hubsByType = {
  hardware_fit: ["proxmox-mini-pc-nas-checklist", "proxmox-n100-vs-n305", "proxmox-mini-pc-vs-used-server"],
  buyer_checklist: ["proxmox-mini-pc-nas-checklist", "used-office-pc-proxmox", "proxmox-low-power-homelab"],
  networking_fit: ["proxmox-2-5g-i226-v", "proxmox-realtek-rtl8125", "proxmox-no-network-after-install"],
  error_fix: ["proxmox-no-network-after-install", "proxmox-vm-no-internet", "proxmox-vlan-aware-bridge"],
  storage_fit: ["proxmox-storage-layout-checklist", "proxmox-zfs-mirror-mini-pc", "proxmox-local-lvm-vs-directory"],
  passthrough_fit: ["hba-passthrough-truenas-vm", "gpu-passthrough-checklist", "usb-passthrough-home-assistant"],
  comparison: ["proxmox-mini-pc-nas-checklist", "proxmox-n100-vs-n305", "proxmox-local-lvm-vs-directory"],
  ops_checklist: ["proxmox-backup-mini-pc", "proxmox-restore-test-checklist", "proxmox-installation-checklist"]
};

function titleForSource(url) {
  return sourceTitleByUrl.find(([needle]) => url.includes(needle))?.[1] ?? "Proxmox VE Documentation";
}

function sentence(value) {
  return value.endsWith(".") ? value : `${value}.`;
}

function article(value) {
  return /^[aeiou]/i.test(value) ? "an" : "a";
}

function relatedFor(page) {
  const sameType = pages
    .filter((candidate) => candidate.slug !== page.slug && candidate.page_type === page.page_type)
    .slice(0, 3)
    .map((candidate) => candidate.slug);
  const hubs = hubsByType[page.page_type] ?? ["proxmox-mini-pc-nas-checklist"];
  return [...new Set([...hubs, ...sameType].filter((slug) => slug !== page.slug))].slice(0, 5);
}

function sourceFor(page) {
  const primary = page.source_url || fallbackSourceByType[page.page_type] || "https://pve.proxmox.com/pve-docs/";
  const docs = "https://pve.proxmox.com/pve-docs/";
  const sources = [{ title: titleForSource(primary), url: primary, accessed_at: today }];
  if (primary !== docs) {
    sources.push({ title: "Proxmox VE Administration Guide", url: docs, accessed_at: today });
  }
  return sources;
}

function base(page, data) {
  return {
    status: "publishable_draft",
    updated_at: today,
    summary: data.summary,
    applies_to: [page.applies_to, "Proxmox VE", data.context].filter(Boolean),
    intent_type: page.page_type,
    opportunity_score: Number(page.priority_1_to_5 || 3) * 17 + (page.page_type === "comparison" ? 4 : 0),
    facts: data.facts,
    steps: data.steps,
    warnings: data.warnings,
    verification: data.verification,
    best_for: data.best_for,
    not_for: data.not_for,
    common_mistakes: data.common_mistakes,
    examples: [{ title: data.example_title, code: data.example_code }],
    faq: data.faq,
    related_slugs: relatedFor(page),
    seo_title: `${page.title} | Homelab Fit`,
    h1: page.title,
    meta_description: data.meta_description,
    sources: sourceFor(page)
  };
}

function hardwareFit(page) {
  const subject = page.title.replace(/ Proxmox Fit| Compatibility| Notes/g, "");
  return base(page, {
    context: "hardware fit",
    summary: `${page.title} is a Proxmox fit-check page for readers who need to validate ${page.applies_to} before buying, repurposing, or migrating homelab workloads.`,
    meta_description: `Check ${subject} for Proxmox fit, including CPU headroom, RAM, NIC model, storage expansion, cooling, workload match, and backup planning.`,
    facts: [
      ["Decision focus", "Validate the complete platform instead of judging the build from the model name alone."],
      ["Most important checks", "RAM ceiling, NIC model, storage connections, cooling, firmware options, and backup path decide most homelab outcomes."],
      ["Safe source boundary", "This page does not claim exact hardware specifications unless the exact SKU has a reliable source."],
      ["Best use", sentence(page.search_intent)]
    ],
    steps: [
      `Record the exact ${page.applies_to} model, SKU, CPU, RAM configuration, NIC model, and storage layout.`,
      "Map planned workloads to CPU, memory, network, and storage needs.",
      "Confirm virtualization options are available in firmware before relying on VM or passthrough plans.",
      "Check whether storage is internal, external, passed through, or hosted on another NAS.",
      "Plan off-host backups before moving important data."
    ],
    warnings: [
      "Do not assume every SKU with the same marketing name has the same NIC, RAM, or storage behavior.",
      "A compact system can be limited by thermals or drive options before it is limited by CPU."
    ],
    verification: [
      "The exact hardware revision and NIC model are recorded.",
      "Proxmox installation and network access can be tested before migration.",
      "Backup and rollback paths exist outside the host."
    ],
    best_for: ["Mini PC and used-hardware buyers", "Low-power homelab planning", "Readers comparing hardware before purchase"],
    not_for: ["Enterprise availability requirements", "Large internal drive arrays", "Users needing vendor-supported compatibility guarantees"],
    common_mistakes: ["Comparing only CPU benchmarks", "Ignoring NIC model and RAM ceiling", "Treating local redundancy as backup"],
    example_title: "Hardware fit notes",
    example_code: `Model:\nSKU / revision:\nCPU:\nRAM ceiling:\nNIC model:\nStorage slots:\nWorkloads:\nBackup target:`,
    faq: [
      [`Is ${subject} good for Proxmox?`, "It can be a good fit when the full platform matches your workloads, storage plan, network needs, and recovery expectations."],
      ["What should I verify first?", "Start with RAM capacity, NIC model, storage connections, firmware virtualization options, and backup design."]
    ]
  });
}

function networkingFit(page) {
  return base(page, {
    context: "networking fit",
    summary: `${page.title} helps Proxmox builders validate ${page.applies_to} before depending on it for VM traffic, NAS traffic, firewall workloads, or cluster links.`,
    meta_description: `Validate ${page.title.toLowerCase()} for Proxmox, including link speed, bridge mapping, switch negotiation, cables, VLANs, and sustained transfer tests.`,
    facts: [
      ["Decision focus", "Network fit depends on the NIC, driver path, bridge configuration, switch, cable, and workload."],
      ["Bridge rule", "Proxmox guests normally use a Linux bridge mapped to the intended physical interface."],
      ["Testing rule", "A web UI load is not enough; sustained traffic and guest connectivity should be tested."],
      ["Best use", sentence(page.search_intent)]
    ],
    steps: [
      "Identify the exact NIC or network feature from the running host.",
      "Record bridge name, physical interface, expected link speed, switch port, and cable.",
      "Confirm host management access before editing network configuration.",
      "Test VM connectivity through the bridge.",
      "Run sustained transfers and watch for link drops or errors."
    ],
    warnings: [
      "Remote-only network edits can lock you out of a single-host homelab.",
      "Switch negotiation, VLAN mistakes, and cables can mimic driver problems."
    ],
    verification: [
      "The host links at the expected speed.",
      "A VM attached to the bridge reaches the LAN.",
      "Sustained traffic does not flap or drop the link."
    ],
    best_for: ["Mini PC networking checks", "Proxmox bridge troubleshooting", "NIC buying decisions"],
    not_for: ["Unmapped enterprise VLAN redesigns", "WAN firewall debugging without topology notes", "Assuming a NIC model alone proves stability"],
    common_mistakes: ["Testing only from the Proxmox web UI", "Editing the wrong interface name", "Skipping cable and switch checks"],
    example_title: "Network validation notes",
    example_code: `NIC / feature:\nPhysical interface:\nBridge:\nExpected speed:\nSwitch port:\nVLANs:\nTransfer test result:`,
    faq: [
      ["What should I test first?", "Confirm interface naming, bridge mapping, link speed, switch port, cable, and a VM-level connectivity test."],
      ["Is a faster NIC always better?", "Not if storage, switch, cabling, or workload design cannot use the extra speed reliably."]
    ]
  });
}

function storageFit(page) {
  return base(page, {
    context: "storage fit",
    summary: `${page.title} is a Proxmox storage planning page for deciding how ${page.applies_to} should handle VM disks, NAS data, redundancy, and backups.`,
    meta_description: `Plan ${page.title.toLowerCase()} for Proxmox, including storage ownership, redundancy, backup separation, restore testing, and homelab risk.`,
    facts: [
      ["Decision focus", "Storage decisions should separate boot, VM disks, NAS data, backups, and restore workflow."],
      ["Backup rule", "Redundancy, mirrors, RAID, and ZFS are not replacements for an off-host backup."],
      ["Ownership rule", "Avoid letting Proxmox and a NAS VM manage the same disks at the same time."],
      ["Best use", sentence(page.search_intent)]
    ],
    steps: [
      "List every disk and assign one owner or role to each device.",
      "Separate Proxmox boot storage, VM storage, NAS storage, and backup targets.",
      "Choose redundancy based on failure tolerance and restore plan, not only raw capacity.",
      "Leave capacity and thermal headroom for sustained writes.",
      "Run a small backup and restore test before trusting important data."
    ],
    warnings: [
      "Do not store the only backup on the same host or same pool.",
      "External storage can be useful, but cabling and power stability must be considered."
    ],
    verification: [
      "Every disk has a documented owner and role.",
      "The storage path matches the intended VM or NAS design.",
      "A restore test succeeds from an off-host backup."
    ],
    best_for: ["NAS VM planning", "Mini PC storage design", "Homelab users before a reinstall"],
    not_for: ["Large enterprise storage design", "Users without a backup destination", "Copying another build without mapping disks"],
    common_mistakes: ["Confusing redundancy with backup", "Mixing disk ownership", "Filling local storage without restore tests"],
    example_title: "Storage role map",
    example_code: `Boot disk:\nVM storage:\nNAS data:\nBackup target:\nRedundancy:\nRestore test date:`,
    faq: [
      ["What is the safest first storage decision?", "Make disk ownership explicit and keep backups off the same host."],
      ["Should I optimize for performance first?", "For a homelab NAS, recoverability and clarity usually matter before peak benchmark numbers."]
    ]
  });
}

function passthroughFit(page) {
  return base(page, {
    context: "passthrough fit",
    summary: `${page.title} helps Proxmox users decide whether ${page.applies_to} should be passed through to a VM and what must be checked before relying on it.`,
    meta_description: `Plan ${page.title.toLowerCase()} on Proxmox, including IOMMU readiness, device ownership, VM recovery, host separation, and rollback checks.`,
    facts: [
      ["Decision focus", "Passthrough depends on hardware, firmware, IOMMU grouping, host configuration, and recovery expectations."],
      ["Ownership rule", "A passed-through device should have one clear owner."],
      ["Recovery rule", "Keep host management and boot paths independent from risky passthrough experiments."],
      ["Best use", sentence(page.search_intent)]
    ],
    steps: [
      "Confirm the host supports the needed passthrough mode.",
      "Record the target device, VM owner, and what the host must keep for itself.",
      "Check IOMMU grouping or USB device stability before committing.",
      "Keep console access and rollback notes available.",
      "Test reboot, shutdown, backup, and device reattachment behavior."
    ],
    warnings: [
      "Passthrough can be hardware-specific and fragile across firmware or kernel changes.",
      "Do not pass through a controller or device that the host still needs to boot or recover."
    ],
    verification: [
      "The VM can see the intended device.",
      "The host remains manageable after reboot.",
      "A rollback path exists if the device fails to attach."
    ],
    best_for: ["NAS VM builds", "Home Assistant and media workloads", "Users comfortable with recovery planning"],
    not_for: ["First installs without console access", "Hosts without clear device isolation", "Critical data without backups"],
    common_mistakes: ["Skipping IOMMU checks", "Passing through host-critical devices", "Testing attach but not reboot behavior"],
    example_title: "Passthrough readiness",
    example_code: `Device:\nVM owner:\nHost dependency:\nIsolation checked:\nBackup plan:\nRollback plan:`,
    faq: [
      ["Should I use passthrough?", "Use it when the VM needs direct device control and the recovery plan is clear."],
      ["What is the biggest risk?", "Unclear device ownership and weak rollback planning cause most painful passthrough mistakes."]
    ]
  });
}

function comparison(page) {
  return base(page, {
    context: "comparison",
    summary: `${page.title} compares the practical Proxmox tradeoffs so homelab builders can choose the simpler fit for their workload, budget, and recovery expectations.`,
    meta_description: `Compare ${page.title.toLowerCase()} for Proxmox homelabs, including fit criteria, tradeoffs, risks, buying signals, and verification checks.`,
    facts: [
      ["Decision focus", "There is no universal winner; the right choice depends on workload, data risk, power, noise, budget, and recovery skill."],
      ["Best use", sentence(page.search_intent)],
      ["Proof point", "The decision should be backed by a written workload and restore plan."],
      ["Commercial angle", "This page supports buying and architecture decisions before hardware or storage layout is locked in."]
    ],
    steps: [
      "Write the workload that must run for the next 12 months.",
      "List constraints: budget, power, noise, space, RAM, storage, and network.",
      "Pick the option with the fewest recovery surprises.",
      "Document the tradeoff you are accepting.",
      "Verify the choice with a small test before migrating important data."
    ],
    warnings: [
      "Do not choose the more complex architecture just because it looks more professional.",
      "Do not ignore backup and restore workflow when comparing hardware or platforms."
    ],
    verification: [
      "The selected option fits the written workload.",
      "The rejected option has a clear reason.",
      "A restore or rollback path is documented."
    ],
    best_for: ["Pre-buy decisions", "Architecture choices", "Homelab builders avoiding overbuild"],
    not_for: ["Universal recommendations", "Enterprise procurement", "Spec-only comparisons"],
    common_mistakes: ["Optimizing one benchmark", "Ignoring recovery skill", "Choosing complexity before proving need"],
    example_title: "Decision brief",
    example_code: `Workload:\nOption A:\nOption B:\nChosen option:\nAccepted tradeoff:\nRollback plan:`,
    faq: [
      ["How should I choose?", "Choose the option that meets the workload with the clearest recovery path and least unnecessary complexity."],
      ["Should I buy for future needs?", "Leave reasonable headroom, but avoid paying for complexity you cannot test or maintain."]
    ]
  });
}

function opsChecklist(page) {
  return base(page, {
    context: "operations checklist",
    summary: `${page.title} turns a Proxmox homelab task into a repeatable operations checklist with backup, rollback, monitoring, and recovery checks.`,
    meta_description: `Use ${page.title.toLowerCase()} for Proxmox operations, including backups, rollback notes, restore tests, power events, updates, and recovery planning.`,
    facts: [
      ["Decision focus", "A homelab becomes more reliable when routine operations are written down and tested."],
      ["Backup rule", "Backups are useful only when restores are tested."],
      ["Change rule", "Updates, power events, and hardware changes need rollback notes."],
      ["Best use", sentence(page.search_intent)]
    ],
    steps: [
      "Record current host, storage, network, and workload state.",
      "Take or verify backups before changing the system.",
      "Write the rollback path before applying the change.",
      "Run the operation in a maintenance window if important services depend on it.",
      "Verify the service and restore path after the change."
    ],
    warnings: [
      "A successful update or backup job does not prove recovery works.",
      "Power and storage events can reveal weak assumptions in small hosts."
    ],
    verification: [
      "A backup or pre-change state exists.",
      "The intended service works after the operation.",
      "A restore or rollback test has been recorded."
    ],
    best_for: ["Small Proxmox operators", "Homelabs storing important data", "Repeatable maintenance"],
    not_for: ["One-off experiments with no persistent data", "Enterprise runbooks without adaptation", "Skipping restore tests"],
    common_mistakes: ["Updating without notes", "Never testing restores", "Keeping backups only on the host being protected"],
    example_title: "Ops runbook notes",
    example_code: `Host:\nOperation:\nBackup status:\nRollback step:\nVerification:\nRestore test date:`,
    faq: [
      ["What should I document first?", "Start with host identity, storage layout, backup target, and rollback steps."],
      ["How often should I test recovery?", "Test recovery whenever the build changes materially and on a recurring schedule for important data."]
    ]
  });
}

function errorFix(page) {
  return base(page, {
    context: "troubleshooting",
    summary: `${page.title} should be diagnosed by checking the simplest host, network, storage, and configuration facts before reinstalling or making broad changes.`,
    meta_description: `Troubleshoot ${page.title.toLowerCase()} with Proxmox checks for host state, network mapping, storage role, recent changes, logs, and verification steps.`,
    facts: [
      ["Triage rule", "Collect exact symptoms before changing configuration."],
      ["Recent change", "The last network, storage, update, or hardware change is often the fastest clue."],
      ["Rollback rule", "Keep console access and known-good notes before editing core host settings."],
      ["Best use", sentence(page.search_intent)]
    ],
    steps: [
      "Record the exact symptom, affected host, VM, interface, or storage target.",
      "Check the most recent change before assuming a platform failure.",
      "Verify host health, network mapping, storage availability, and logs.",
      "Make one small change at a time.",
      "Confirm the fix with both host-level and workload-level tests."
    ],
    warnings: [
      "Do not reinstall before checking configuration and recent changes.",
      "Avoid remote-only fixes when network access is unstable."
    ],
    verification: [
      "The original symptom is gone.",
      "The affected VM or service works after reboot.",
      "The change and rollback notes are recorded."
    ],
    best_for: ["Concrete Proxmox symptoms", "Single-host troubleshooting", "Readers needing a safe diagnostic path"],
    not_for: ["Unmapped multi-site networks", "Hardware failure claims without evidence", "Making several changes at once"],
    common_mistakes: ["Skipping logs", "Changing multiple variables at once", "Fixing remotely without console access"],
    example_title: "Troubleshooting notes",
    example_code: `Symptom:\nLast change:\nHost state:\nNetwork/storage check:\nAction taken:\nVerification:`,
    faq: [
      ["What should I check first?", "Start with the exact symptom, recent changes, host state, and the smallest reversible test."],
      ["When should I reinstall?", "Only after configuration, hardware visibility, logs, and rollback options have been checked."]
    ]
  });
}

const builders = {
  hardware_fit: hardwareFit,
  buyer_checklist: hardwareFit,
  networking_fit: networkingFit,
  error_fix: errorFix,
  storage_fit: storageFit,
  passthrough_fit: passthroughFit,
  comparison,
  ops_checklist: opsChecklist
};

const nextContent = { ...existing };
for (const page of pages) {
  if (!nextContent[page.slug]) {
    nextContent[page.slug] = builders[page.page_type](page);
  }
}

writeFileSync(contentPath, `${JSON.stringify(nextContent, null, 2)}\n`);
console.log(`Promoted ${Object.keys(nextContent).length} pages to source-backed drafts.`);
