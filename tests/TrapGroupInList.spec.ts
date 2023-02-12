import { html } from 'lit-html';
import { test, expect } from '@playwright/test';
import { FocusKitPage } from './FocusKitPage.js';

test('should set tabindex="-1" on TrapGroup parent', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.createCommander();

  await focuskitPage.render(html`
<div id="list">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <div tabindex="0" id="group">
    <button type="button" id="group-1">Foo</button>
    <button type="button" id="group-2">Foo</button>
  </div>
  <button type="button" id="after-group">Foo</button>
  <button type="button">Foo</button>
</div>`);

  await focuskitPage.createList('list');
  await focuskitPage.createTrapGroup('group');
  await focuskitPage.waifForTabIndex('group', -1);
});

test('should not move focus into TrapGroup with arrow keys', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.createCommander();

  await focuskitPage.render(html`
<div id="list">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <div tabindex="0" id="group">
    <button type="button" id="group-1">Foo</button>
    <button type="button" id="group-2">Foo</button>
  </div>
  <button type="button" id="after-group">Foo</button>
  <button type="button">Foo</button>
</div>`);

  await focuskitPage.createList('list');
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await focuskitPage.waitForActiveElement('group');

  await page.keyboard.press('ArrowDown');
  await focuskitPage.waitForActiveElement('after-group');
});


test('should not move focus out TrapGroup with arrow keys', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.createCommander();

  await focuskitPage.render(html`
<div id="list">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <div tabindex="0" id="group">
    <button type="button" id="group-1">Foo</button>
    <button type="button" id="group-2">Foo</button>
  </div>
  <button type="button" id="after-group">Foo</button>
  <button type="button">Foo</button>
</div>`);

  await focuskitPage.createList('list');
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await focuskitPage.waitForActiveElement('group-1');

  await page.keyboard.press('ArrowDown');
  await focuskitPage.waitForActiveElement('group-1');
});

test('should not trap focus in TrapGroup', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.createCommander();

  await focuskitPage.render(html`
<div id="list">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <div tabindex="0" id="group">
    <button type="button" id="group-1">Foo</button>
    <button type="button" id="group-2">Foo</button>
  </div>
  <button type="button" id="after-group">Foo</button>
  <button type="button">Foo</button>
</div>`);

  await focuskitPage.createList('list');
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await focuskitPage.waitForActiveElement('group-1');

  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('group-2');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('group-1');
});

test('should continue with List after Escape from TrapGroup', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  await focuskitPage.createCommander();

  await focuskitPage.render(html`
<div id="list">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <div tabindex="0" id="group">
    <button type="button" id="group-1">Foo</button>
    <button type="button" id="group-2">Foo</button>
  </div>
  <button type="button" id="after-group">Foo</button>
  <button type="button">Foo</button>
</div>`);

  await focuskitPage.createList('list');
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await focuskitPage.waitForActiveElement('group-1');

  page.keyboard.press('Escape');
  await focuskitPage.waitForActiveElement('group');

  page.keyboard.press('ArrowDown');
  await focuskitPage.waitForActiveElement('after-group');

  page.keyboard.press('ArrowUp');
  await focuskitPage.waitForActiveElement('group');
});