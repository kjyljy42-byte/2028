import test from "node:test";
import assert from "node:assert/strict";
import { getCountdown } from "../src/utils/countdown.js";
import { createCalendar } from "../src/utils/calendar.js";
import { wedding } from "../src/data/wedding.js";
import { submitRsvp, getLocalResponses } from "../src/services/rsvp.js";
test("Moscow target, second ticks, exact zero and elapsed date", () => {
  assert.equal(
    new Date(wedding.startsAt).toISOString(),
    "2028-06-22T10:00:00.000Z",
  );
  assert.deepEqual(
    getCountdown(wedding.startsAt, Date.parse("2028-06-21T08:58:57Z")),
    { total: 90063, days: 1, hours: 1, minutes: 1, seconds: 3 },
  );
  assert.equal(
    getCountdown(wedding.startsAt, Date.parse("2028-06-21T08:58:58Z")).seconds,
    2,
  );
  assert.equal(
    getCountdown(wedding.startsAt, Date.parse(wedding.startsAt)).total,
    0,
  );
  assert.equal(
    getCountdown(wedding.startsAt, Date.parse("2029-01-01")).total,
    0,
  );
});
test("RFC 5545 calendar has correct UTC start, escaped location and UTF-8 folding", () => {
  const ics = createCalendar(new Date("2026-01-01T00:00:00Z"));
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0"));
  assert.ok(ics.includes("DTSTART:20280622T100000Z\r\n"));
  const unfolded = ics.replace(/\r\n /g, "");
  assert.ok(unfolded.includes("SUMMARY:Свадебный пир — Валерий и Юлия"));
  assert.ok(
    unfolded.includes(
      "LOCATION:Few Horses\\, Наро-Фоминский округ\\, деревня Новосумино",
    ),
  );
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  for (const line of ics.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
});
test("RSVP adapter records all fields locally and isolates drink arrays", async () => {
  const drinks = ["Эль", "Другое"];
  const saved = await submitRsvp({
    guestName: " Гость ",
    attendance: "yes",
    overnight: "Нет, уеду вечером",
    transfer: "Не нужен",
    food: "Рыба",
    drinks,
    customDrink: " Квас ",
  });
  drinks.push("Сидр");
  assert.equal(saved.guestName, "Гость");
  assert.equal(saved.customDrink, "Квас");
  assert.deepEqual(saved.drinks, ["Эль", "Другое"]);
  const all = getLocalResponses();
  all[0].drinks.push("Водка");
  assert.equal(getLocalResponses()[0].drinks.length, 2);
});
