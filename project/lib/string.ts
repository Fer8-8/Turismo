type ParsedSchedule = {
  days: string;
  hours: string;
};

// Normalize day abbreviations (Spanish)
// const DAY_MAP: Record<string, string> = {
//   Lun: "Lunes",
//   Mar: "Martes",
//   Mié: "Miércoles",
//   Mie: "Miércoles",
//   Jue: "Jueves",
//   Vie: "Viernes",
//   Sáb: "Sábado",
//   Sab: "Sábado",
//   Dom: "Domingo",
//   // English
//   Mon: "Monday",
//   Tue: "Tuesday",
//   Wed: "Wednesday",
//   Thu: "Thursday",
//   Fri: "Friday",
//   Sat: "Saturday",
//   Sun: "Sunday",
// };

// Pattern 1: "Lun–Dom 13:00–23:00" (range days, range hours)
const RANGE_PATTERN = /^(\w+)[–-](\w+)\s+(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})$/;

// Pattern 2: "Lun–Vie 09:00–18:00, Sáb 10:00–14:00" (multiple segments)
// const multiPattern = /(.+?)\s+(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})/g;

// function expandDay(abbr: string): string {
//   return DAY_MAP[abbr.trim()] ?? abbr.trim();
// }

/**
 * Parse a 24-hour time string to 12-hour format (e.g. "13:00" -> "1:00pm")
 */
function to12h(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = Number.parseInt(hStr, 10);
  const m = Number.parseInt(mStr, 10);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${mStr}${period}`;
}

export function parseStringSchedule(raw: string): ParsedSchedule | null {
  if (!raw || raw === "nan" || raw === "N/A") {
    return null;
  }

  // // Pattern 3: "Abierto 24 horas" / "24/7"
  // if (/24\s*\/\s*7|24\s*horas/i.test(raw)) {
  //   return { days: "Todos los días", hours: "24 horas" };
  // }

  // Try range pattern first
  const rangeMatch = raw.match(RANGE_PATTERN);
  if (rangeMatch) {
    const [, dayFrom, dayTo, timeFrom, timeTo] = rangeMatch;
    return {
      // days: `${expandDay(dayFrom)} – ${expandDay(dayTo)}`,
      days: `${dayFrom} – ${dayTo}`,
      hours: `${to12h(timeFrom)} – ${to12h(timeTo)}`,
    };
  }

  // // Try multi-segment pattern
  // const segments: ParsedSchedule[] = [];
  // let match;
  // while ((match = multiPattern.exec(raw)) !== null) {
  //   const [, daysPart, timeFrom, timeTo] = match;
  //   segments.push({
  //     days: daysPart.trim(),
  //     hours: `${timeFrom} – ${timeTo}`,
  //   });
  // }
  // if (segments.length > 0) {
  //   return {
  //     days: segments.map((s) => s.days).join(", "),
  //     hours: segments.map((s) => s.hours).join(", "),
  //   };
  // }

  // Fallback: just return raw as days
  return { days: raw, hours: "" };
}

/**
 * Normalizes a text string by removing accents and converting to lowercase.
 */
export function normalizeText(text: string) {
  return text
    .normalize("NFD") // separate accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase(); // ignore case
}

/**
 * Converts a string to camelCase.
 */
export function toCamelCaseKey(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}
