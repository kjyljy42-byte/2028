import { wedding } from "../data/wedding.js";
const escape = (value) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
const utc = (date) =>
  new Date(date)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
// RFC 5545: fold at 75 octets, without splitting UTF-8 characters.
export function foldLine(line) {
  let result = "",
    current = "",
    size = 0;
  for (const char of line) {
    const bytes = new TextEncoder().encode(char).length;
    if (size + bytes > 75) {
      result += current + "\r\n";
      current = " ";
      size = 1;
    }
    current += char;
    size += bytes;
  }
  return result + current;
}
export function createCalendar(now = new Date()) {
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Chronicle//RU",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:valery-yulia-20280622@wedding-chronicle.local",
      `DTSTAMP:${utc(now)}`,
      `DTSTART:${utc(wedding.startsAt)}`,
      `SUMMARY:${escape("Свадебный пир — " + wedding.names)}`,
      `LOCATION:${escape(wedding.venue + ", " + wedding.address)}`,
      "DESCRIPTION:Сбор гостей — 13:00 по московскому времени.",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(foldLine)
      .join("\r\n") + "\r\n"
  );
}
export function downloadCalendar() {
  const url = URL.createObjectURL(
    new Blob([createCalendar()], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "valery-yulia-2028.ics";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
