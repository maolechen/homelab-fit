import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const contentPath = resolve("data/homelab-page-content.json");
const content = JSON.parse(readFileSync(contentPath, "utf8"));

const refinements = {
  "best-mini-pc-for-proxmox-nas": {
    summary: "The best mini PC for a Proxmox NAS is not the fastest one; it is the quiet box whose storage, NIC, RAM, cooling, and backup path are boring enough to trust.",
    quick_answer: "For a first Proxmox NAS, choose the mini PC that makes failure recovery easiest: known NIC, enough replaceable RAM, a clear drive layout, and backups outside the box. N100/N305-class systems can work well, but only after the storage plan passes the checklist.",
    editorial_intro: "This page is intentionally conservative. A good first NAS host should not make you clever on day one. It should make disk ownership, backups, network testing, and future restores obvious enough that you can explain the whole build from memory.",
    verdict: {
      label: "Buyer verdict",
      headline: "Buy the simplest box that makes storage and recovery obvious.",
      recommendation: "A low-power mini PC is a good Proxmox NAS host when it has a known NIC, enough RAM, a realistic drive path, and a backup target outside the host.",
      best_for: "Quiet first NAS builds, Home Assistant plus file services, and small media or container stacks.",
      avoid_if: "You need many internal HDD bays, enterprise-style redundancy, or cannot place backups outside the mini PC.",
      biggest_risk: "Buying a quiet efficient CPU and discovering too late that the storage path is cramped."
    },
    buyer_scenarios: [
      {
        situation: "I want a quiet shelf NAS",
        path: "Choose a low-power mini PC only after the drive and backup plan are written down.",
        why: "Noise and power are easy wins, but NAS reliability comes from storage ownership and restore tests.",
        href: "/wiki/proxmox-mini-pc-nas-checklist/"
      },
      {
        situation: "I want one box for NAS plus services",
        path: "Prefer N100/N305-class hardware with enough RAM and a known 2.5G NIC.",
        why: "The CPU is usually fine; RAM, NIC, and drive layout decide whether the box stays pleasant.",
        href: "/wiki/n100-n305-homelab-buyer-guide/"
      },
      {
        situation: "I want TrueNAS in a VM",
        path: "Read the passthrough and disk ownership pages before buying around this design.",
        why: "A NAS VM can work, but only when Proxmox boot storage and NAS-owned disks are cleanly separated.",
        href: "/wiki/hba-passthrough-truenas-vm/"
      }
    ],
    safe_default: {
      title: "Beginner-safe default",
      body: "Start with Proxmox-managed storage, an off-box backup, and no storage passthrough. Add a NAS VM only after you can explain disk ownership and recovery.",
      checks: ["Known Intel NIC or well-documented Realtek path", "32 GB RAM target when running multiple services", "Backup target outside the mini PC"]
    },
    upgrade_path: [
      "Add a second internal SSD or external NAS only after restore testing works.",
      "Move to HBA passthrough when the host has clean IOMMU groups and separate boot storage.",
      "Move to a used server or storage appliance if drive bays matter more than noise and power."
    ],
    decision_matrix: {
      title: "Which mini PC NAS path should you choose?",
      headers: ["Situation", "Safer first choice", "Move up when"],
      rows: [
        ["Mostly containers plus light file sharing", "N100/N305 mini PC with simple Proxmox storage", "RAM or storage limits become visible"],
        ["Important family files", "Mini PC plus off-box backup or separate NAS", "You can test restore without the mini PC"],
        ["TrueNAS VM goal", "Delay passthrough until disk ownership is clear", "HBA isolation and rollback are proven"],
        ["Many HDDs", "Used server, DAS, or dedicated NAS chassis", "Noise and power are acceptable"]
      ]
    },
    saveable_summary: {
      title: "Save this before checkout",
      items: ["CPU is rarely the first NAS problem.", "Unknown NICs create avoidable pain.", "A mirror is not a backup.", "If the disk owner is unclear, do not buy yet."]
    },
    faq: [
      ["What mini PC should I buy for a Proxmox NAS?", "Buy the model whose storage layout, NIC model, RAM ceiling, and backup path are clear. For many beginners, that is more important than choosing the fastest CPU."],
      ["Is Intel N100 enough for a Proxmox NAS?", "Usually yes for a small NAS plus light services, as long as RAM, storage, and backups fit the plan."],
      ["Is Intel N305 worth it?", "It is worth considering when the price gap is small and you expect more VMs, but it does not fix weak storage or backup design."],
      ["Should I use USB disks?", "USB disks can be acceptable for labs or backup rotation, but they are a weaker primary data path for important NAS storage."],
      ["Should beginners run TrueNAS as a VM?", "Only after understanding passthrough, disk ownership, and rollback. A simpler Proxmox storage layout is often better for a first build."],
      ["What should stop me from buying?", "Unknown NIC model, no backup destination, no clear drive layout, or a chassis that cannot hold the storage you expect."]
    ],
    reading_path: [
      { slug: "proxmox-mini-pc-nas-checklist", label: "Run the NAS checklist", reason: "Turn the buyer guide into a concrete pre-buy scorecard." },
      { slug: "n100-n305-homelab-buyer-guide", label: "Choose N100 or N305", reason: "Decide whether value or CPU headroom matters more." },
      { slug: "proxmox-storage-layout-beginners", label: "Plan storage roles", reason: "Separate boot, VM, NAS, and backup storage before buying." },
      { slug: "proxmox-passthrough-beginner-checklist", label: "Check passthrough risk", reason: "Use this before buying around a NAS VM design." }
    ]
  },
  "proxmox-mini-pc-buying-checklist": {
    summary: "A good Proxmox mini PC purchase starts with the boring checks: exact SKU, RAM ceiling, NIC model, storage slots, cooling, BIOS access, and a backup target.",
    quick_answer: "Do not buy from a product page alone. Fill out the SKU, NIC, RAM, storage, cooling, and backup fields first; if any of those are unknown, treat the deal as unfinished research.",
    editorial_intro: "Most bad mini PC purchases are not disasters. They are tiny daily annoyances: a vague NIC, soldered RAM, one awkward drive slot, a fan that ramps under load, or backups that live beside the data. This checklist exists to catch those before the return window closes.",
    verdict: {
      label: "Buyer verdict",
      headline: "A cheap mini PC is only cheap if the unknowns are gone.",
      recommendation: "Buy when the exact SKU has a known NIC, enough RAM, a storage layout that matches the job, and a recovery plan outside the machine.",
      best_for: "First-time Proxmox buyers comparing mini PCs and used office machines.",
      avoid_if: "The listing hides the NIC, RAM configuration, BIOS options, or storage slot details.",
      biggest_risk: "Saving money on the box and paying for it later with cramped storage or network instability."
    },
    buyer_scenarios: [
      {
        situation: "I only need Home Assistant and a few containers",
        path: "Choose an efficient mini PC with replaceable RAM and simple storage.",
        why: "The safest first build is boring, quiet, and easy to back up.",
        href: "/wiki/proxmox-low-power-homelab/"
      },
      {
        situation: "I want a NAS too",
        path: "Run the NAS guide before choosing the model.",
        why: "Drive layout and backups can disqualify an otherwise nice mini PC.",
        href: "/wiki/best-mini-pc-for-proxmox-nas/"
      },
      {
        situation: "I already own an office PC",
        path: "Use the same checks, but pay extra attention to power, noise, and drive bays.",
        why: "Used hardware can be a great first host when the placement and storage tradeoffs fit.",
        href: "/wiki/used-office-pc-proxmox/"
      }
    ],
    safe_default: {
      title: "Beginner-safe default",
      body: "Buy a system with documented Linux/Proxmox experience, replaceable RAM, a known NIC, and enough internal storage for boot plus VM disks.",
      checks: ["Exact SKU and NIC recorded", "RAM can reach the target workload", "Backup target exists before install"]
    },
    upgrade_path: [
      "Move from one mini PC to a small cluster only after restore and update habits are solid.",
      "Move from mini PC to used server when PCIe slots or HDD bays become the real requirement.",
      "Move from local storage to NAS VM only after disk ownership is clear."
    ],
    decision_matrix: {
      title: "Mini PC buying decision matrix",
      headers: ["Constraint", "Prefer this", "Avoid this"],
      rows: [
        ["Lowest power", "N100/N305-class mini PC", "Old rack server for always-on light services"],
        ["More drive bays", "Used office SFF, DAS, or NAS chassis", "Tiny mini PC with one internal SSD"],
        ["Firewall/router", "Multiple known NICs", "Unknown 2.5G ports with no console plan"],
        ["Beginner simplicity", "Proxmox-managed storage first", "Passthrough-first NAS design"]
      ]
    },
    saveable_summary: {
      title: "Save this before checkout",
      items: ["Exact SKU beats brand name.", "NIC model beats advertised speed.", "RAM ceiling beats launch price.", "Backup path beats storage optimism."]
    },
    faq: [
      ["What is the safest first Proxmox mini PC?", "One with documented Linux support, replaceable RAM, a known NIC, and enough internal storage for the actual workload."],
      ["How much RAM should I target?", "For a simple host, 16 GB can work. For a NAS plus several services, 32 GB is a more comfortable planning target."],
      ["Should I avoid Realtek NICs?", "Not always, but identify the exact model and check Linux/Proxmox experience before buying."],
      ["Is used office hardware better?", "It can be better for drive bays and cost, but may lose on power, noise, size, and idle efficiency."],
      ["What is the biggest buying mistake?", "Buying for CPU benchmark while ignoring RAM ceiling, NIC model, storage slots, and backups."]
    ],
    reading_path: [
      { slug: "best-mini-pc-for-proxmox-nas", label: "Buying for NAS", reason: "Use this if storage is part of the plan." },
      { slug: "n100-n305-homelab-buyer-guide", label: "N100 vs N305", reason: "Pick value or headroom after workload planning." },
      { slug: "proxmox-mini-pc-vs-used-server", label: "Mini PC vs used server", reason: "Check when expansion matters more than quiet." },
      { slug: "proxmox-storage-layout-beginners", label: "Storage layout", reason: "Map disk roles before install." }
    ]
  },
  "n100-n305-homelab-buyer-guide": {
    summary: "Intel N100 is usually the better value for quiet beginner Proxmox hosts, while N305 is the better headroom choice when more simultaneous VMs are likely.",
    quick_answer: "Choose N100 when your workload list is small and known. Choose N305 when you expect more VMs, the price gap is modest, and the exact mini PC still has enough RAM, storage, cooling, and a known NIC.",
    editorial_intro: "N100 vs N305 looks like a CPU comparison, but buyers rarely regret the CPU alone. They regret buying too little RAM, accepting a vague NIC, or expecting a tiny chassis to become a real NAS.",
    verdict: {
      label: "Buyer verdict",
      headline: "N100 is value; N305 is margin. The platform still decides.",
      recommendation: "For a first homelab, N100 is the default value pick. N305 is worth it when the extra cost buys real workload margin and the surrounding mini PC is not compromised.",
      best_for: "Buyers deciding between low-power Alder Lake-N mini PCs.",
      avoid_if: "You are trying to solve storage, RAM, or NIC problems with a CPU upgrade.",
      biggest_risk: "Paying for N305 headroom while buying a box with the same cramped storage and RAM limits."
    },
    buyer_scenarios: [
      {
        situation: "I want cheap and quiet",
        path: "Pick N100 after confirming RAM, NIC, and storage.",
        why: "It usually covers light containers, Home Assistant, DNS, small VMs, and basic services.",
        href: "/wiki/intel-n100-proxmox-nas/"
      },
      {
        situation: "I expect more VMs",
        path: "Pick N305 if the complete system is still good.",
        why: "More CPU headroom helps only when RAM and cooling do not become the bottleneck first.",
        href: "/wiki/intel-n305-proxmox-homelab/"
      },
      {
        situation: "I want NAS plus services",
        path: "Choose storage layout before CPU.",
        why: "NAS builds fail around disks and backups before they fail around Alder Lake-N CPU choice.",
        href: "/wiki/proxmox-storage-layout-beginners/"
      }
    ],
    safe_default: {
      title: "Beginner-safe default",
      body: "Choose N100 for a known light workload. Move to N305 only when your written VM/container list needs the headroom.",
      checks: ["Workload list fits the CPU", "RAM target is not soldered too low", "Cooling can sustain the expected load"]
    },
    upgrade_path: [
      "Upgrade from N100 to N305 when multiple VMs are always on.",
      "Upgrade from Alder Lake-N to Ryzen or workstation-class mini PC when CPU-heavy workloads dominate.",
      "Upgrade to used server hardware when PCIe expansion and drive bays matter more than idle power."
    ],
    decision_matrix: {
      title: "N100 vs N305 buyer matrix",
      headers: ["Need", "Choose N100", "Choose N305"],
      rows: [
        ["Budget", "Lowest total cost matters", "Price gap is small"],
        ["Workload", "Containers and light VMs", "More simultaneous VMs"],
        ["NAS role", "Storage plan is modest", "Services around NAS need headroom"],
        ["Experimentation", "Known workload list", "You want CPU margin for labs"]
      ]
    },
    saveable_summary: {
      title: "Save this before checkout",
      items: ["N100 is the default value pick.", "N305 is margin, not magic.", "RAM and storage can veto either CPU.", "Compare complete systems, not silicon."]
    },
    faq: [
      ["Is N100 enough for Proxmox?", "Yes for many beginner homelabs with light VMs and containers, provided RAM and storage are planned."],
      ["When is N305 worth it?", "When the price gap is modest and your workload list includes more simultaneous VMs or CPU-heavy services."],
      ["Does N305 make a better NAS?", "Not by itself. Storage layout, NIC, backups, and restore tests matter more for NAS reliability."],
      ["Should I buy N100 and upgrade later?", "If the workload is known and light, yes. If you already know you need many VMs, buy the headroom first."],
      ["What else should I compare?", "RAM ceiling, NIC model, internal storage options, cooling, and vendor/community Linux experience."]
    ],
    reading_path: [
      { slug: "proxmox-n100-vs-n305", label: "Detailed N100 vs N305 comparison", reason: "Use the narrower comparison after this buyer guide." },
      { slug: "intel-n100-proxmox-nas", label: "N100 NAS fit", reason: "Check the lower-power path." },
      { slug: "intel-n305-proxmox-homelab", label: "N305 homelab fit", reason: "Check the headroom path." },
      { slug: "proxmox-mini-pc-buying-checklist", label: "Mini PC buying checklist", reason: "Verify the complete system before buying." }
    ]
  },
  "proxmox-storage-layout-beginners": {
    summary: "A beginner-friendly Proxmox storage layout names each role first: boot, VM disks, ISOs/templates, NAS data, backups, and restore testing.",
    quick_answer: "Do not start with ZFS vs local-lvm vs directory. Start by naming what each disk stores and who owns it. The safest beginner layout is the one you can restore without guessing.",
    editorial_intro: "Storage is where a fun lab quietly becomes infrastructure. The trick is to avoid cleverness until the roles are clear: boot should be boring, VM disks should be recoverable, NAS data should have one owner, and backups should leave the host.",
    verdict: {
      label: "Storage verdict",
      headline: "Choose roles before formats.",
      recommendation: "For a first Proxmox host, keep disk ownership simple and backups off-box. Add ZFS, NAS VMs, or passthrough only after you can explain the restore path.",
      best_for: "Beginners choosing between local-lvm, directory storage, ZFS, and NAS VM ownership.",
      avoid_if: "You cannot say which system owns each disk or where restores come from.",
      biggest_risk: "Mixing boot, VM disks, NAS data, and backups into one vague storage bucket."
    },
    buyer_scenarios: [
      {
        situation: "I just want VMs and containers",
        path: "Use the default Proxmox storage layout and keep backups separate.",
        why: "The default is easier to learn and recover than a custom storage design on day one.",
        href: "/wiki/proxmox-local-lvm-vs-directory/"
      },
      {
        situation: "I want mirrored local storage",
        path: "Use ZFS only after drive count, RAM, scrub, and backup expectations are clear.",
        why: "ZFS improves some failure modes but does not replace backups.",
        href: "/wiki/proxmox-zfs-mirror-mini-pc/"
      },
      {
        situation: "I want a NAS VM",
        path: "Decide disk ownership before passthrough.",
        why: "Data risk rises when Proxmox and the NAS VM both appear to manage the same disks.",
        href: "/wiki/proxmox-nas-vm-disk-ownership/"
      }
    ],
    safe_default: {
      title: "Beginner-safe default",
      body: "Keep Proxmox boot and VM storage simple, store backups outside the host, and delay passthrough until the disk ownership model is obvious.",
      checks: ["Boot disk is not the only backup location", "VM disks and ISO/template storage have separate roles", "Restore test is scheduled before real data moves in"]
    },
    upgrade_path: [
      "Move from default local storage to ZFS mirror when you have two suitable drives and backup discipline.",
      "Move from Proxmox-managed storage to NAS VM only when disk ownership is clean.",
      "Move from local backup to Proxmox Backup Server or external NAS when data matters."
    ],
    decision_matrix: {
      title: "Beginner storage decision matrix",
      headers: ["Storage role", "Beginner-safe choice", "Upgrade when"],
      rows: [
        ["Boot", "Separate small SSD or default install target", "You need mirrored boot and understand recovery"],
        ["VM disks", "Proxmox-managed local-lvm or directory", "You need ZFS features and can test restores"],
        ["NAS data", "One clear owner", "Passthrough/IOMMU is proven"],
        ["Backups", "Off-box target", "PBS or external NAS is available"]
      ]
    },
    saveable_summary: {
      title: "Save this before changing disks",
      items: ["Every disk needs one owner.", "Backups leave the host.", "ZFS is not a backup.", "Restore tests matter more than layout diagrams."]
    },
    faq: [
      ["Should beginners use local-lvm or directory?", "Use local-lvm for VM disks when you are comfortable with Proxmox managing block storage; use directory storage when file visibility matters more."],
      ["Should I use ZFS?", "Use ZFS when drive count, RAM, backup, and recovery expectations are clear. Do not use it as a substitute for backups."],
      ["Can one disk hold everything?", "It can for a lab, but it is a weak design for important data because boot, VMs, NAS files, and backups share the same failure point."],
      ["Where should backups go?", "Outside the same host: another machine, NAS, removable rotation, or Proxmox Backup Server target."],
      ["When should I use passthrough?", "Only when device ownership, IOMMU groups, boot separation, and rollback are understood."]
    ],
    reading_path: [
      { slug: "proxmox-local-lvm-vs-directory", label: "local-lvm vs directory", reason: "Choose the first storage target behavior." },
      { slug: "proxmox-zfs-mirror-mini-pc", label: "ZFS mirror on mini PC", reason: "Check the two-drive local storage path." },
      { slug: "proxmox-nas-vm-disk-ownership", label: "NAS VM disk ownership", reason: "Avoid shared ownership mistakes." },
      { slug: "proxmox-restore-test-checklist", label: "Restore test checklist", reason: "Prove the layout before trusting data." }
    ]
  },
  "proxmox-passthrough-beginner-checklist": {
    summary: "Proxmox passthrough is a good beginner project only when the device owner, IOMMU group, host dependency, rollback path, and backup plan are all clear.",
    quick_answer: "If you cannot name the IOMMU group, the VM owner, and the rollback steps, do not build your first Proxmox NAS around passthrough. Start simpler, then add passthrough once recovery is boring.",
    editorial_intro: "Passthrough is attractive because it feels like direct control. The catch is that direct control also means direct failure modes. Beginners should treat passthrough as an architecture decision, not a command snippet.",
    verdict: {
      label: "Passthrough verdict",
      headline: "Use passthrough when recovery is already boring.",
      recommendation: "HBA, GPU, Coral, and USB passthrough can work well, but the host must not depend on the device and rollback must be written before the change.",
      best_for: "NAS VM builders, GPU/Coral workloads, and Home Assistant USB devices with a tested rollback path.",
      avoid_if: "This is your first storage design, IOMMU groups are unclear, or local console access is unavailable.",
      biggest_risk: "Passing through a device the host still needs for boot, storage, or recovery."
    },
    buyer_scenarios: [
      {
        situation: "I want TrueNAS as a VM",
        path: "Pass the HBA only after boot storage and NAS disks are separated.",
        why: "The NAS VM should own its disks, while Proxmox keeps independent management storage.",
        href: "/wiki/hba-passthrough-truenas-vm/"
      },
      {
        situation: "I need a USB Zigbee or Coral device",
        path: "Start with USB passthrough and document the physical port.",
        why: "Small USB devices are often easier to recover than storage controller passthrough.",
        href: "/wiki/usb-passthrough-home-assistant/"
      },
      {
        situation: "I want GPU passthrough",
        path: "Check IOMMU groups, reset behavior, and fallback console access first.",
        why: "GPU passthrough can fail in hardware-specific ways that are painful remotely.",
        href: "/wiki/gpu-passthrough-checklist/"
      }
    ],
    safe_default: {
      title: "Beginner-safe default",
      body: "Do the first Proxmox build without passthrough. Add one device only after backups, local console access, and rollback notes exist.",
      checks: ["IOMMU group checked", "Host boot does not depend on the device", "Rollback tested before real data moves"]
    },
    upgrade_path: [
      "Start with USB passthrough for non-critical devices.",
      "Move to HBA passthrough when storage ownership and boot separation are clean.",
      "Move to GPU passthrough only after console fallback and reset behavior are tested."
    ],
    decision_matrix: {
      title: "Passthrough readiness matrix",
      headers: ["Device", "Beginner-safe path", "Do not proceed until"],
      rows: [
        ["USB coordinator", "Pass through one known port/device", "You can recover Home Assistant without it"],
        ["Coral TPU", "USB Coral first if possible", "The VM can reboot cleanly"],
        ["HBA", "Pass through whole controller", "Proxmox boot is separate"],
        ["GPU", "Test on non-critical host", "Console fallback and reset behavior are proven"]
      ]
    },
    saveable_summary: {
      title: "Save this before enabling passthrough",
      items: ["One device, one owner.", "Host boot stays separate.", "Rollback is written first.", "Do not trust storage until reboot and restore are tested."]
    },
    faq: [
      ["Is passthrough safe for beginners?", "It can be, but only when device ownership, rollback, and host independence are clear."],
      ["Should I pass through disks or an HBA?", "For NAS VM designs, passing the whole HBA is often cleaner when hardware isolation supports it."],
      ["What should I test first?", "Reboot behavior, VM start order, device visibility, host access, and restore path."],
      ["Can passthrough break after updates?", "Yes. Firmware, kernel, and hardware changes can affect passthrough, so rollback notes matter."],
      ["What is the simplest alternative?", "Keep storage in Proxmox-managed pools and use ordinary VM disks until passthrough is truly needed."]
    ],
    reading_path: [
      { slug: "hba-passthrough-truenas-vm", label: "HBA passthrough to TrueNAS VM", reason: "Use this for NAS VM storage ownership." },
      { slug: "gpu-passthrough-checklist", label: "GPU passthrough checklist", reason: "Check the higher-risk device path." },
      { slug: "usb-passthrough-home-assistant", label: "USB passthrough for Home Assistant", reason: "Start with the simpler passthrough case." },
      { slug: "proxmox-storage-layout-beginners", label: "Storage layout first", reason: "Keep storage recovery clear before passthrough." }
    ]
  }
};

for (const [slug, fields] of Object.entries(refinements)) {
  if (!content[slug]) {
    throw new Error(`Missing pillar content for ${slug}`);
  }

  content[slug] = {
    ...content[slug],
    ...fields,
    sources: content[slug].sources
  };
}

writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Refined ${Object.keys(refinements).length} pillar guides.`);
