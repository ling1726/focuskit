import { test, expect } from "@playwright/test";
import { html } from "lit-html";
import { FocusKitPage } from "./FocusKitPage.js";

test('should only have one tabindex="0" element', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(
    html`
      <div id="list">
        <button type="button" id="one">One</button>
        <button type="button" id="two">Two</button>
        <button type="button" id="three">Three</button>
        <button type="button" id="four">Four</button>
        <button type="button" id="five">Five</button>
        <button type="button" id="six">Six</button>
      </div>
    `
  );

  await focuskitPage.createCommander();
  await focuskitPage.createList("list");
  await page.keyboard.press("Tab");

  await focuskitPage.waitForActiveElement("one");

  await focuskitPage.waitForActiveElement("one");
  await focuskitPage.waitForTabIndex("one", 0);

  const ids = ["two", "three", "four", "five", "six"];

  await focuskitPage.waitForTabIndexes(ids, -1);
});

test("should change focused element with arrow", async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(
    html`
      <div id="list">
        <button type="button" id="one">One</button>
        <button type="button" id="two">Two</button>
        <button type="button" id="three">Three</button>
        <button type="button" id="four">Four</button>
        <button type="button" id="five">Five</button>
        <button type="button" id="six">Six</button>
      </div>
    `
  );

  await focuskitPage.createCommander();
  await focuskitPage.createList("list");
  await page.keyboard.press("Tab");

  await page.keyboard.press("ArrowDown");
  await focuskitPage.waitForActiveElement("two");
  await focuskitPage.waitForTabIndex("two", 0);

  await focuskitPage.waitForTabIndexes(
    ["one", "three", "four", "five", "six"],
    -1
  );

  await page.keyboard.press("ArrowUp");
  await focuskitPage.waitForActiveElement("one");
  await focuskitPage.waitForTabIndex("one", 0);

  await focuskitPage.waitForTabIndexes(
    ["two", "three", "four", "five", "six"],
    -1
  );
});

test("should do circular navigation", async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(
    html`
      <div id="list">
        <button type="button" id="one">One</button>
        <button type="button" id="two">Two</button>
        <button type="button" id="three">Three</button>
        <button type="button" id="four">Four</button>
        <button type="button" id="five">Five</button>
        <button type="button" id="six">Six</button>
      </div>
    `
  );

  await focuskitPage.createCommander();
  await focuskitPage.createList("list");
  await page.keyboard.press("Tab");

  await page.keyboard.press("ArrowUp");
  await focuskitPage.waitForActiveElement("six");

  await page.keyboard.press("ArrowDown");
  await focuskitPage.waitForActiveElement("one");
});
