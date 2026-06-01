/**
 * Formats a date range into a compact readable string.
 * Same day: "26 jun · 6:00 p.m. – 8:00 p.m." — Multi-day: "26 jun – 2 jul · 6:00 p.m."
 */
export function formatRangeDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const fmt = (d: Date) =>
    d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });

  const time = (d: Date) =>
    d.toLocaleTimeString("es-MX", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return `${fmt(start)} · ${time(start)} – ${time(end)}`;
  }

  return `${fmt(start)} – ${fmt(end)} · ${time(start)}`;
}
