/**
 * Appointment slot system for Dr. Iqbal's Homoeopathy Centre.
 *
 * Clinic hours: Monday–Saturday, 10:00 AM – 9:00 PM (closed Sunday).
 * Every hour is split into exactly four 15-minute slots, e.g. for 10–11:
 *   10:00–10:15, 10:15–10:30, 10:30–10:45, 10:45–11:00
 *
 * The last bookable slot is 8:45 PM – 9:00 PM.
 */

export const CLINIC_OPEN_HOUR = 10; // 10:00 AM
export const CLINIC_CLOSE_HOUR = 22; // 10:00 PM (slots run up to, not past, this)
export const SLOT_MINUTES = 15;

export interface Slot {
  /** Canonical value stored as schedule_time, e.g. "10:00 AM - 10:15 AM" */
  value: string;
  /** Start label, e.g. "10:00 AM" */
  start: string;
  /** End label, e.g. "10:15 AM" */
  end: string;
  /** Compact display label, e.g. "10:00 – 10:15 AM" */
  label: string;
  /** Hour group label, e.g. "10:00 AM" */
  hourLabel: string;
}

export interface SlotGroup {
  hourLabel: string;
  slots: Slot[];
}

function format12h(hour24: number, minute: number): { time: string; period: 'AM' | 'PM' } {
  const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  const mm = minute.toString().padStart(2, '0');
  return { time: `${hour12}:${mm}`, period };
}

/** Generate every 15-minute slot for a clinic working day. */
export function generateDailySlots(): Slot[] {
  const slots: Slot[] = [];

  for (let h = CLINIC_OPEN_HOUR; h < CLINIC_CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      let endH = h;
      let endM = m + SLOT_MINUTES;
      if (endM === 60) {
        endH = h + 1;
        endM = 0;
      }

      const s = format12h(h, m);
      const e = format12h(endH, endM);
      const start = `${s.time} ${s.period}`;
      const end = `${e.time} ${e.period}`;

      // Compact label: drop the start period when both ends share it (e.g. "10:00 – 10:15 AM").
      const label =
        s.period === e.period ? `${s.time} – ${e.time} ${e.period}` : `${start} – ${end}`;

      const hourLabel = `${format12h(h, 0).time} ${format12h(h, 0).period}`;

      slots.push({ value: `${start} - ${end}`, start, end, label, hourLabel });
    }
  }

  return slots;
}

/** Group slots by their hour for a scannable UI. */
export function groupSlotsByHour(slots: Slot[]): SlotGroup[] {
  const map = new Map<string, Slot[]>();
  for (const s of slots) {
    if (!map.has(s.hourLabel)) map.set(s.hourLabel, []);
    map.get(s.hourLabel)!.push(s);
  }
  return Array.from(map.entries()).map(([hourLabel, groupSlots]) => ({
    hourLabel,
    slots: groupSlots,
  }));
}

/** True if the given yyyy-mm-dd date falls on a Sunday (clinic closed). */
export function isSunday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(`${dateStr}T00:00:00`);
  return d.getDay() === 0;
}
