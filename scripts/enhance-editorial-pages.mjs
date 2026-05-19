import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const path = resolve("data/homelab-page-content.json");
const content = JSON.parse(readFileSync(path, "utf8"));

const enhancements = {
  "proxmox-mini-pc-nas-checklist": {
    image_alt: "Editorial diagram showing a mini PC connected to CPU, NIC, storage, cooling, and backup checks",
    image_caption: "The best mini PC NAS decisions happen before the checkout page: storage ownership, NIC model, and backups matter more than the CPU sticker.",
    editorial_intro: "A mini PC NAS is tempting because it is quiet, efficient, and easy to hide on a shelf. The trap is that NAS builds fail quietly in the boring places: not enough drive connections, a flaky 2.5G port, unclear disk ownership, or no real restore path. Treat the box like a platform decision, not a gadget purchase.",
    decision_table: {
      title: "Pre-buy decision grid",
      headers: ["Check", "Good sign", "Risk signal"],
      rows: [
        ["Storage", "Two internal drives or a clear external/NAS plan", "Single tiny SSD expected to hold everything"],
        ["Network", "Known NIC model with sustained-transfer testing", "Unknown 2.5G port and no switch/cable plan"],
        ["Workloads", "Written list of VMs, containers, and NAS duties", "Buying for vague future expansion"],
        ["Recovery", "Backup target outside the mini PC", "Mirror or RAID treated as the backup"]
      ]
    },
    field_notes: {
      eyebrow: "Builder note",
      title: "The boring checklist is the product.",
      body: "Readers searching this topic are usually already half-convinced. The page should slow them down just enough to prevent the expensive mistake: buying a nice small box that has no comfortable path for drives, backups, or recovery."
    }
  },
  "intel-n100-proxmox-nas": {
    image_alt: "Editorial diagram of an Intel N100 mini PC Proxmox NAS fit check",
    image_caption: "N100 is a good efficiency baseline, but the mini PC around it decides whether the NAS build feels easy or cramped.",
    editorial_intro: "The Intel N100 is popular for the right reason: it gives homelab builders enough modern CPU for many always-on services without the noise and power draw of old servers. But an N100 NAS is not really an N100 decision. It is a chassis, RAM, NIC, storage, and backup decision with a low-power CPU in the middle.",
    decision_table: {
      title: "N100 fit checklist",
      headers: ["Build goal", "Likely fit", "Check before buying"],
      rows: [
        ["Home Assistant plus containers", "Strong fit", "RAM ceiling and USB device plan"],
        ["Small NAS services", "Conditional fit", "Drive count, backup target, and NIC stability"],
        ["Multiple heavy VMs", "Weak-to-conditional fit", "RAM, cooling, and CPU headroom"],
        ["Media workloads", "Conditional fit", "Transcoding needs and storage bandwidth"]
      ]
    },
    field_notes: {
      eyebrow: "Buying lens",
      title: "Do not let the CPU hide the storage problem.",
      body: "A cheap N100 box can be an excellent Proxmox node, but it cannot magically become a drive-bay NAS. If the storage path is awkward on paper, it will be worse after you trust data to it."
    }
  },
  "minisforum-ms-01-proxmox": {
    image_alt: "Editorial diagram of a compact Proxmox host with networking, NVMe, workloads, and backup checks",
    image_caption: "The MS-01 belongs in the more capable mini PC category: good for compact expansion planning, still not a replacement for storage discipline.",
    editorial_intro: "The MS-01 is interesting because it sits between tiny low-power boxes and traditional used servers. That makes it useful, but also easy to over-read: expansion options create possibilities, not a complete architecture. The right question is not whether it can run Proxmox. The question is whether its particular configuration makes your storage, network, and recovery plan simpler.",
    decision_table: {
      title: "MS-01 decision grid",
      headers: ["Need", "Why it may fit", "What to verify"],
      rows: [
        ["Compact lab with network headroom", "More capable than entry mini PCs", "Exact NICs and switch plan"],
        ["NVMe-heavy VM host", "Useful compact storage options", "Thermals and backup path"],
        ["NAS replacement", "Possible in some designs", "Disk ownership and external backup"],
        ["Small cluster node", "Compact and repeatable", "Power, cooling, and identical SKU notes"]
      ]
    },
    field_notes: {
      eyebrow: "Editorial stance",
      title: "Treat premium mini PCs as architecture choices.",
      body: "A more capable mini PC deserves a stronger page than a spec summary. Readers need to know what it makes easier, what it does not solve, and what they must still test."
    }
  },
  "proxmox-n100-vs-n305": {
    image_alt: "Editorial comparison diagram for Intel N100 versus Intel N305 Proxmox mini PCs",
    image_caption: "N100 versus N305 is really value versus headroom, with storage and RAM still doing most of the practical work.",
    editorial_intro: "This comparison is easy to flatten into benchmarks, but benchmarks are not what usually breaks a homelab. The real tradeoff is whether you want the cheapest efficient node that comfortably handles known tasks, or whether you want extra CPU headroom for a busier small host. Either way, the platform around the chip has veto power.",
    decision_table: {
      title: "N100 vs N305 decision grid",
      headers: ["Constraint", "Choose N100 when", "Choose N305 when"],
      rows: [
        ["Budget", "Price matters more than headroom", "The price gap is small"],
        ["Workload", "Containers and light VMs dominate", "More simultaneous VMs are expected"],
        ["NAS use", "Storage plan is modest and clear", "CPU headroom helps adjacent services"],
        ["Risk", "You can live inside known limits", "You want margin for experiments"]
      ]
    },
    field_notes: {
      eyebrow: "Decision note",
      title: "The better CPU cannot fix a cramped box.",
      body: "If RAM is soldered low, the NIC is unknown, or storage expansion is awkward, N305 headroom will not rescue the build. Compare complete systems, not just silicon."
    }
  },
  "proxmox-mini-pc-vs-used-server": {
    image_alt: "Editorial comparison diagram for mini PC versus used server Proxmox hardware",
    image_caption: "Mini PCs win on power and quiet; used servers win when expansion, bays, and serviceability are the real job.",
    editorial_intro: "This is the fork many homelab builders hit after the first successful Proxmox install. A mini PC feels modern and civilized. A used server feels capable and forgiving. Neither is the adult choice by default. The adult choice is the one whose failure modes you can afford, hear, power, cool, and recover from.",
    decision_table: {
      title: "Mini PC vs used server decision grid",
      headers: ["Need", "Mini PC advantage", "Used server advantage"],
      rows: [
        ["Power and noise", "Usually much better", "Often a compromise"],
        ["Drive bays", "Limited or external", "Usually stronger"],
        ["PCIe expansion", "Limited", "Much stronger"],
        ["Living-space use", "Easy to place", "Often too loud or large"]
      ]
    },
    field_notes: {
      eyebrow: "Practical stance",
      title: "The winner depends on where the machine has to live.",
      body: "A rack server in the wrong room is a failed product, no matter how good the price was. A mini PC with no path for storage is the same mistake in a quieter costume."
    }
  },
  "proxmox-local-lvm-vs-directory": {
    image_alt: "Editorial storage diagram comparing Proxmox local-lvm and directory storage",
    image_caption: "The local-lvm versus directory choice is less about ideology and more about what kind of data you expect to inspect, move, and restore.",
    editorial_intro: "New Proxmox users often meet local-lvm as a surprise: it works, but it does not feel like a normal folder. Directory storage feels simpler, but that simplicity can blur roles if backups, ISOs, VM disks, and shared files all pile into the same place. The useful move is to name what each storage target is for.",
    decision_table: {
      title: "Storage role comparison",
      headers: ["Use case", "local-lvm fit", "Directory fit"],
      rows: [
        ["VM disks", "Strong default fit", "Works when file-based simplicity matters"],
        ["ISO images", "Not the natural fit", "Strong fit"],
        ["Backups", "Usually not the clearest target", "Common for simple local backups"],
        ["Manual inspection", "Less convenient", "Much easier"]
      ]
    },
    field_notes: {
      eyebrow: "Storage note",
      title: "Choose roles before choosing formats.",
      body: "Most beginner storage pain comes from mixing roles. Decide where VM disks, ISOs, backups, and shared files belong before the disk fills up."
    }
  }
};

for (const [slug, fields] of Object.entries(enhancements)) {
  content[slug] = {
    ...content[slug],
    ...fields
  };
}

writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Enhanced ${Object.keys(enhancements).length} editorial pages.`);
