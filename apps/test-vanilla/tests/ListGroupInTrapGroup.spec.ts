import { test } from "@playwright/test";
import { html } from "lit-html";
import { FocusKitPage } from "./FocusKitPage.js";

test("should tab through listgroup", async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(html`
    <div id="group" tabindex="0">
      <button type="button" id="before-listgroup">Foo</button>
      <div id="listgroup" tabindex="0">
        <button type="button" id="listgroup-1">ListGroup</button>
        <button type="button" id="listgroup-2">ListGroup</button>
        <button type="button" id="listgroup-3">ListGroup</button>
      </div>
      <button type="button" id="after-listgroup">Foo</button>
    </div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup("group");
  await focuskitPage.createListGroup("listgroup");

  await page.keyboard.press("Tab");
  await focuskitPage.waitForActiveElement("group");
  await page.keyboard.press("Enter");

  await focuskitPage.waitForActiveElement("before-listgroup");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await focuskitPage.waitForActiveElement("after-listgroup");
  await focuskitPage.waitForTabIndexes(
    ["before-listgroup", "listgroup", "after-listgroup"],
    0
  );
  await focuskitPage.waitForTabIndexes(
    ["listgroup-1", "listgroup-2", "listgroup-3"],
    -1
  );
});

test("should tab out of listgroup", async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(html`
    <div id="group" tabindex="0">
      <button type="button" id="before-listgroup">Foo</button>
      <div id="listgroup" tabindex="0">
        <button type="button" id="listgroup-1">ListGroup</button>
        <button type="button" id="listgroup-2">ListGroup</button>
        <button type="button" id="listgroup-3">ListGroup</button>
      </div>
      <button type="button" id="after-listgroup">Foo</button>
    </div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup("group");
  await focuskitPage.createListGroup("listgroup");

  await page.keyboard.press("Tab");
  await focuskitPage.waitForActiveElement("group");
  await page.keyboard.press("Enter");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await focuskitPage.waitForActiveElement("listgroup-1");
  await focuskitPage.waitForTabIndexes(
    ["before-listgroup", "after-listgroup"],
    0
  );
  await focuskitPage.waitForTabIndexes(
    ["listgroup", "listgroup-2", "listgroup-3"],
    -1
  );

  await page.keyboard.press("Tab");
  await focuskitPage.waitForActiveElement("after-listgroup");
  await focuskitPage.waitForTabIndexes(
    ["before-listgroup", "listgroup", "after-listgroup"],
    0
  );
  await focuskitPage.waitForTabIndexes(
    ["listgroup-1", "listgroup-2", "listgroup-3"],
    -1
  );
});

test("should not tab back into listgroup", async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(html`
    <div id="group" tabindex="0">
      <button type="button" id="before-listgroup">Foo</button>
      <div id="listgroup" tabindex="0">
        <button type="button" id="listgroup-1">ListGroup</button>
        <button type="button" id="listgroup-2">ListGroup</button>
        <button type="button" id="listgroup-3">ListGroup</button>
      </div>
      <button type="button" id="after-listgroup">Foo</button>
    </div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup("group");
  await focuskitPage.createListGroup("listgroup");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");

  await focuskitPage.waitForActiveElement("listgroup");
  await focuskitPage.waitForTabIndexes(
    ["before-listgroup", "listgroup", "after-listgroup"],
    0
  );
  await focuskitPage.waitForTabIndexes(
    ["listgroup-1", "listgroup-2", "listgroup-3"],
    -1
  );
});
