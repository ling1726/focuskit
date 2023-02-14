import { test } from '@playwright/test';
import { html } from 'lit-html';
import { FocusKitPage } from './FocusKitPage.js';

test('should not arrow into ListGroup', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(html`
<div id="list">
  <button type="button" id="before-listgroup">List</button>
  <div id="listgroup" tabindex="0">
    <button type="button" id="listgroup-1">ListGroup</button>
    <button type="button" id="listgroup-2">ListGroup</button>
    <button type="button" id="listgroup-3">ListGroup</button>
  </div>
  <button type="button" id="after-listgroup">List</button>
</div>
</div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createList('list');
  await focuskitPage.createListGroup('listgroup');

  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('before-listgroup');

  await page.keyboard.press('ArrowDown');
  await focuskitPage.waitForActiveElement('listgroup');
  await focuskitPage.waitForTabIndex('listgroup', 0);
  await focuskitPage.waitForTabIndexes(['listgroup-1', 'listgroup-2', 'listgroup-3'], -1);

  await page.keyboard.press('ArrowDown');
  await focuskitPage.waitForActiveElement('after-listgroup');
});

test('should not tab into List from ListGroup', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(html`
<div id="list">
  <button type="button" id="before-listgroup">List</button>
  <div id="listgroup" tabindex="0">
    <button type="button" id="listgroup-1">ListGroup</button>
    <button type="button" id="listgroup-2">ListGroup</button>
    <button type="button" id="listgroup-3">ListGroup</button>
  </div>
  <button type="button" id="after-listgroup">List</button>
</div>
</div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createList('list');
  await focuskitPage.createListGroup('listgroup');

  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await focuskitPage.waitForTabIndex('listgroup-1', 0);
  await focuskitPage.waitForTabIndexes(['listgroup-2', 'listgroup-3'], -1);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await focuskitPage.waitForActiveElement('before-listgroup');
  await focuskitPage.waitForTabIndex('before-listgroup', 0);
});

test('should tab back into List', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(html`
<div id="list">
  <button type="button" id="before-listgroup">List</button>
  <div id="listgroup" tabindex="0">
    <button type="button" id="listgroup-1">ListGroup</button>
    <button type="button" id="listgroup-2">ListGroup</button>
    <button type="button" id="listgroup-3">ListGroup</button>
  </div>
  <button type="button" id="after-listgroup">List</button>
</div>
</div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createList('list');
  await focuskitPage.createListGroup('listgroup');

  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');

  await focuskitPage.waitForActiveElement('before-listgroup');
  await focuskitPage.waitForTabIndexes(['listgroup', 'listgroup-1', 'listgroup-2', 'listgroup-2'], -1);
  await focuskitPage.waitForTabIndex('before-listgroup', 0);
});

test('should not tab into ListGroup', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.render(html`
<div id="list">
  <div id="listgroup" tabindex="0">
    <button type="button" id="listgroup-1">ListGroup</button>
    <button type="button" id="listgroup-2">ListGroup</button>
    <button type="button" id="listgroup-3">ListGroup</button>
  </div>
  <button type="button" id="after-listgroup">List</button>
</div>
</div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createList('list');
  await focuskitPage.createListGroup('listgroup');

  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('listgroup');
  await focuskitPage.waitForTabIndex('listgroup', 0);
  await focuskitPage.waitForTabIndexes(['listgroup-1', 'listgroup-2', 'listgroup-3'], -1);

  await page.keyboard.press('ArrowDown');
  await focuskitPage.waitForActiveElement('after-listgroup');
});