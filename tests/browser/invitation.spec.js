import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
test("full cinematic sequence, opening, focus, session persistence and 13 sections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Открыть приглашение" }),
  ).toBeHidden();
  await page.screenshot({ path: "/tmp/wedding-opening-day.png" });
  await expect
    .poll(() => page.locator("video").evaluate((v) => v.ended))
    .toBe(true);
  await expect(page.locator("video")).toHaveJSProperty("muted", true);
  await expect(
    page.getByRole("button", { name: "Открыть приглашение" }),
  ).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: "/tmp/wedding-opening-night.png" });
  await page.getByRole("button", { name: "Открыть приглашение" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("[data-section]")).toHaveCount(13);
  await expect(page.locator("#invitation")).toBeFocused();
  await page.screenshot({ path: "/tmp/wedding-mobile.png", fullPage: true });
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#hero-title")).toBeVisible();
  expect(errors).toEqual([]);
});
test("RSVP choices, custom drink, validation, mock submission, map and calendar", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть приглашение" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Показать на карте" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Ссылка на карту" }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Добавить в календарь" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("valery-yulia-2028.ics");
  const ics = await fs.readFile(await download.path(), "utf8");
  expect(ics).toContain("DTSTART:20280622T100000Z");
  await page.getByLabel("Ваше имя и фамилия").fill("Анна Петрова");
  await page.getByRole("button", { name: "Подтвердить присутствие" }).click();
  await expect(page.getByRole("alert")).toContainText("Выберите ночёвку");
  await page
    .getByLabel("Да, остаюсь (захватите пижаму!)", { exact: true })
    .check();
  await page.getByLabel("Нет, уеду вечером", { exact: true }).check();
  await expect(page.locator('input[name="overnight"]:checked')).toHaveCount(1);
  await page.getByLabel("Туда-обратно", { exact: true }).check();
  await page.getByLabel("Только туда", { exact: true }).check();
  await expect(page.locator('input[name="transfer"]:checked')).toHaveCount(1);
  await page.getByLabel("Мясо", { exact: true }).check();
  await page.getByLabel("Рыба", { exact: true }).check();
  await expect(page.locator('input[name="food"]:checked')).toHaveCount(1);
  await page.getByLabel("Эль", { exact: true }).check();
  await page.getByLabel("Красное вино", { exact: true }).check();
  await expect(page.locator("#drinks input:checked")).toHaveCount(2);
  await page.getByLabel("Другое", { exact: true }).check();
  await page.getByLabel("Ваш любимый напиток").fill("Квас");
  await page.getByLabel("Другое", { exact: true }).uncheck();
  await expect(page.locator("#custom-drink")).toHaveCount(0);
  await page.getByLabel("Другое", { exact: true }).check();
  await expect(page.locator("#custom-drink")).toHaveValue("");
  await page.getByLabel("Ваш любимый напиток").fill("Квас");
  await page.getByRole("button", { name: "Подтвердить присутствие" }).click();
  await expect(page.locator(".rsvp-success")).toContainText("Анна Петрова");
  await expect(page.locator(".rsvp-success")).toContainText(
    "ответ сохранён локально",
  );
  await expect(
    page.getByLabel("С радостью буду!", { exact: true }),
  ).toBeChecked();
  await page.getByLabel("К сожалению, не смогу", { exact: true }).check();
  await page.getByRole("button", { name: "Подтвердить присутствие" }).click();
  await expect(page.locator(".rsvp-success")).toContainText(
    "Спасибо за ваш ответ",
  );
  await page.reload();
  await expect(page.locator(".rsvp-success")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("responsive layouts, loaded images, local navigation and keyboard controls", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("wedding-invitation-opened", "yes"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator("#final").scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      for (const image of document.images) {
        image.loading = "eager";
        await image.decode();
      }
    });
    const overflow = await page.evaluate(() => ({
      body: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    expect(
      overflow.body,
      `horizontal overflow at ${width}`,
    ).toBeLessThanOrEqual(overflow.viewport);
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every((i) => i.complete && i.naturalWidth > 0),
        ),
    ).toBe(true);
    for (const anchor of await page.locator('a[href^="#"]').all()) {
      const href = await anchor.getAttribute("href");
      expect(await page.locator(href).count()).toBe(1);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/wedding-desktop.png", fullPage: true });
  await page.locator('input[name="overnight"]').first().focus();
  await page.keyboard.press("Space");
  await expect(page.locator('input[name="overnight"]').first()).toBeChecked();
});
test("countdown ticks every second and shows Today on the wedding date", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("wedding-invitation-opened", "yes"),
  );
  await page.clock.install({ time: new Date("2028-06-21T10:00:03Z") });
  await page.goto("/");
  await expect(page.locator('[data-count="days"]')).toHaveText("00");
  await expect(page.locator('[data-count="hours"]')).toHaveText("23");
  await expect(page.locator('[data-count="seconds"]')).toHaveText("57");
  await page.clock.runFor(1000);
  await expect(page.locator('[data-count="seconds"]')).toHaveText("56");
  await page.clock.setSystemTime(new Date("2028-06-22T10:00:00Z"));
  await page.clock.runFor(1000);
  await expect(page.locator(".today")).toHaveText("Сегодня!");
});

test("full-screen portrait film, dove below characters and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [430, 932],
    [844, 390],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".film-poster")).toBeVisible();
    await expect(page.locator("video")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Пропустить/ })).toHaveCount(
      0,
    );
    const stage = await page.locator(".film-stage").boundingBox();
    expect(stage.x).toBe(0);
    expect(stage.y).toBe(0);
    expect(stage.width).toBe(width);
    expect(stage.height).toBe(height);
    if (width < height) {
      expect(
        await page
          .locator(".film-poster")
          .evaluate((img) => getComputedStyle(img).objectFit),
      ).toBe("cover");
      // Source couple occupies y=.37–.60, x=.34–.65: verify the CTA is below them after cover cropping.
      const scale = Math.max(width / 1080, height / 1758);
      const cropY = (1758 * scale - height) * 0.46;
      const coupleBottom = 1758 * 0.6 * scale - cropY;
      const button = await page.locator(".dove-invitation").boundingBox();
      expect(button.y).toBeGreaterThan(coupleBottom);
      expect(button.y + button.height).toBeLessThanOrEqual(height);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `/tmp/wedding-fullscreen-${width}.png` });
  }
});
test("no skip, blocked autoplay needs playback, failed video permits fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Воспроизвести видео" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Открыть приглашение" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Пропустить/ })).toHaveCount(0);
  await page.route("**/opening-story.mp4", (route) => route.abort());
  await page.reload();
  await expect(page.locator(".film-poster")).toBeVisible();
  await page.getByRole("button", { name: "Открыть приглашение" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("iPhone 16 Pro opening covers changing browser viewport and restores parchment", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    isMobile: true,
    deviceScaleFactor: 3,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  for (const height of [874, 740, 670, 874]) {
    await page.setViewportSize({ width: 402, height });
    const result = await page.evaluate(() => {
      const rect = document
        .querySelector(".film-stage")
        .getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
        height: innerHeight,
        root: getComputedStyle(document.documentElement).backgroundColor,
        body: getComputedStyle(document.body).backgroundColor,
        scroll: document.documentElement.scrollHeight,
        theme: document.querySelector('meta[name="theme-color"]').content,
      };
    });
    expect(result.top).toBe(0);
    expect(result.bottom).toBeGreaterThanOrEqual(result.height);
    expect(result.root).toBe("rgb(16, 26, 40)");
    expect(result.body).toBe("rgb(16, 26, 40)");
    expect(result.scroll).toBeLessThanOrEqual(result.height);
    expect(result.theme).toBe("#101a28");
  }
  await page.screenshot({ path: "/tmp/wedding-iphone16pro.png" });
  await page.getByRole("button", { name: "Открыть приглашение" }).click();
  await expect(page.locator(".opening-video")).toHaveCount(0);
  expect(await page.locator("html").getAttribute("data-opening")).toBeNull();
  expect(
    await page.locator('meta[name="theme-color"]').getAttribute("content"),
  ).toBe("#282d24");
  await expect(page.locator("#hero")).toBeVisible();
  await context.close();
});
