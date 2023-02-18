import { test } from "@playwright/test";
import { html } from "lit-html";
import { FocusKitPage } from "./FocusKitPage.js";

test("should not trap focus when not active", async ({ page }) => {
  const example = html`
    <button type="button" id="before-trap">Foo</button>
    <div id="trap">
      <button type="button" id="trap-1">Trap</button>
      <button type="button" id="trap-2">Trap</button>
      <button type="button" id="trap-3">Trap</button>
    </div>
    <button id="after-trap" type="button">Foo</button>
  `;

  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(example);
  await focuskitPage.createCommander();
  await focuskitPage.createTrap('trap');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await focuskitPage.waitForActiveElement('trap-1');
  await focuskitPage.waitForTabIndexes(['before-trap', 'trap-1', 'trap-2', 'trap-3', 'after-trap'], 0);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('after-trap');

  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await focuskitPage.waitForActiveElement('before-trap');
});

test("should trap focus when active", async ({ page }) => {
  const example = html`
    <button type="button" id="before-trap">Foo</button>
    <div id="trap">
      <button type="button" id="trap-1">Trap</button>
      <button type="button" id="trap-2">Trap</button>
      <button type="button" id="trap-3">Trap</button>
    </div>
    <button id="after-trap" type="button">Foo</button>
  `;

  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(example);
  await focuskitPage.createCommander();
  const trap = await focuskitPage.createTrap('trap');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await focuskitPage.waitForActiveElement('trap-1');
  await trap.enable();

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('trap-1');

  await page.keyboard.press('Shift+Tab');
  await focuskitPage.waitForActiveElement('trap-3');
});

test("should be able to disable trap", async ({ page }) => {
  const example = html`
    <button type="button" id="before-trap">Foo</button>
    <div id="trap">
      <button type="button" id="trap-1">Trap</button>
      <button type="button" id="trap-2">Trap</button>
      <button type="button" id="trap-3">Trap</button>
    </div>
    <button id="after-trap" type="button">Foo</button>
  `;

  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(example);
  await focuskitPage.createCommander();
  const trap = await focuskitPage.createTrap('trap');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await focuskitPage.waitForActiveElement('trap-1');
  await trap.enable();

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('trap-1');

  await trap.disable();

  await page.keyboard.press('Shift+Tab');
  await focuskitPage.waitForActiveElement('before-trap');
});
