import { test, expect } from '@playwright/test';
import { html } from 'lit-html';
import { FocusKitPage } from './FocusKitPage.js';

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
  )

  await focuskitPage.createCommander();
  await focuskitPage.createList('list');
  await page.keyboard.press('Tab');

  expect(await focuskitPage.activeElementId()).toBe('one');

  const focusableElementIds = await focuskitPage.focusableElementIds()
  const tabbableElementIds = await focuskitPage.tabbableElementIds();

  expect(focusableElementIds.length).toBe(5)
  expect(tabbableElementIds.length).toBe(1)

});

test('should change focused element with arrow', async ({ page }) => {
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
  )

  await focuskitPage.createCommander();
  await focuskitPage.createList('list');
  await page.keyboard.press('Tab');

  await page.keyboard.press('ArrowDown');
  expect(await focuskitPage.activeElementId()).toBe('two');

  let focusableElementIds = await focuskitPage.focusableElementIds()
  let tabbableElementIds = await focuskitPage.tabbableElementIds();
  expect(focusableElementIds.length).toBe(5)
  expect(tabbableElementIds.length).toBe(1)

  await page.keyboard.press('ArrowUp');
  expect(await focuskitPage.activeElementId()).toBe('one');

  focusableElementIds = await focuskitPage.focusableElementIds()
  tabbableElementIds = await focuskitPage.tabbableElementIds();
  expect(focusableElementIds.length).toBe(5)
  expect(tabbableElementIds.length).toBe(1)
});

test('should do circular navigation', async ({ page }) => {
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
  )

  await focuskitPage.createCommander();
  await focuskitPage.createList('list');
  await page.keyboard.press('Tab');

  await page.keyboard.press('ArrowUp');
  expect(await focuskitPage.activeElementId()).toBe('six');

  await page.keyboard.press('ArrowDown');
  expect(await focuskitPage.activeElementId()).toBe('one');
})

