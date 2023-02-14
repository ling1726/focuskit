import { test } from '@playwright/test';
import { html } from 'lit-html';
import { FocusKitPage } from './FocusKitPage.js';

test('should not be able to tab into List', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(html`
  <div id="group" tabindex="0">
    <button id="before-list">Foo</button>
    <div id="list">
      <button id="list-1">List</button>
      <button id="list-2">List</button>
      <button id="list-3">List</button>
    </div>
    <button id="after-list">Foo</button>
  </div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await focuskitPage.createList('list');

  await page.keyboard.press('Tab');
  await focuskitPage.waitForTabIndex('group', 0);
  await focuskitPage.waitForActiveElement('group');
  await focuskitPage.waitForTabIndexes(['list-1', 'list-2', 'list-3'], -1);

  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('');
});

test('should not be able to tab into List after Enter', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(html`
  <div id="group" tabindex="0">
    <button id="before-list">Foo</button>
    <div id="list">
      <button id="list-1">List</button>
      <button id="list-2">List</button>
      <button id="list-3">List</button>
    </div>
    <button id="after-list">Foo</button>
  </div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await focuskitPage.createList('list');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await focuskitPage.waitForActiveElement('before-list');

  await focuskitPage.waitForTabIndex('list-1', 0);
  await focuskitPage.waitForTabIndexes(['list-2', 'list-3'], -1);

  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('list-1');

  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('after-list');
});

test('should not be able to navigate List after Enter', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(html`
  <div id="group" tabindex="0">
    <button id="before-list">Foo</button>
    <div id="list">
      <button id="list-1">List</button>
      <button id="list-2">List</button>
      <button id="list-3">List</button>
    </div>
    <button id="after-list">Foo</button>
  </div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await focuskitPage.createList('list');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');

  await page.keyboard.press('ArrowDown');
  await focuskitPage.waitForTabIndex('list-2', 0);
  await focuskitPage.waitForTabIndexes(['list-1', 'list-3'], -1);
});

test('should not be able to tab into List after Escape', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();

  await focuskitPage.render(html`
  <div id="group" tabindex="0">
    <button id="before-list">Foo</button>
    <div id="list">
      <button id="list-1">List</button>
      <button id="list-2">List</button>
      <button id="list-3">List</button>
    </div>
    <button id="after-list">Foo</button>
  </div>
  `);

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await focuskitPage.createList('list');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await focuskitPage.waitForActiveElement('group');

  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('');

  await focuskitPage.waitForTabIndexes(['list-1', 'list-2', 'list-3'], -1);
});