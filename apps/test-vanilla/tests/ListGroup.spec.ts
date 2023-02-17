import { test, expect } from "@playwright/test";
import { html } from "lit-html";
import { FocusKitPage } from "./FocusKitPage.js";

test("should not move focus into ListGroup without Enter", async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(
    html`
      <div id="list" tabindex="0">
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
  await focuskitPage.createListGroup("list");
  await page.keyboard.press("Tab");
  await page.keyboard.press("ArrowDown");

  await focuskitPage.waitForActiveElement("list");

  const ids = ["one", "two", "three", "four", "five", "six"];

  await focuskitPage.waitForTabIndexes(ids, -1);
});

test('should only have one tabindex="0" element', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(
    html`
      <div id="list" tabindex="0">
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
  await focuskitPage.createListGroup("list");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

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
      <div id="list" tabindex="0">
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
  await focuskitPage.createListGroup("list");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

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
      <div id="list" tabindex="0">
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
  await focuskitPage.createListGroup("list");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await page.keyboard.press("ArrowUp");
  await focuskitPage.waitForActiveElement("six");

  await page.keyboard.press("ArrowDown");
  await focuskitPage.waitForActiveElement("one");
});

test("should focus on ListGroup root on escape", async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(
    html`
      <div id="list" tabindex="0">
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
  await focuskitPage.createListGroup("list");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await focuskitPage.waitForActiveElement("one");
  await page.keyboard.press("Escape");
  await focuskitPage.waitForActiveElement("list");
  await focuskitPage.waitForTabIndex("list", 0);
  await focuskitPage.waitForTabIndexes(
    ["one", "two", "three", "four", "five", "six"],
    -1
  );
});
