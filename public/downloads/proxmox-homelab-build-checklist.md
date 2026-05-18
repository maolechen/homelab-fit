# Proxmox Homelab Build Checklist

## Host Fit

- CPU virtualization support confirmed.
- BIOS virtualization options found.
- RAM capacity and replaceability checked.
- NIC model recorded.
- Cooling, noise, and sustained load risk considered.

## Storage Path

- Boot disk, VM storage, NAS storage, and backup target listed separately.
- Disk ownership is clear: Proxmox or NAS VM.
- ZFS layout chosen with capacity headroom.
- Backup destination is outside the same host.

## Networking

- Expected link speed recorded.
- Switch port and cable type recorded.
- Linux bridge name recorded.
- Local console access available before network edits.

## Passthrough

- IOMMU support checked.
- Device isolation checked.
- Proxmox boot storage is separate from passed-through controllers.
- Rollback plan written.

## Recovery

- Backup job configured.
- Restore test date recorded.
- Update and rollback notes recorded.
