import { test, expect } from '@playwright/test';
import { html } from 'lit-html';
import { FocusKitPage } from './FocusKitPage.js';

test('should not tab into contents', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('group');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('');

  await focuskitPage.waitForTabIndexes(['one', 'two'], -1);
});

test('should focus first item on Enter', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await focuskitPage.waitForActiveElement('one');
});

test('should trap focus in group', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await focuskitPage.waitForActiveElement('one');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('two');
  await page.keyboard.press('Tab');
  await focuskitPage.waitForActiveElement('one');
});

test('should focus group parent on Escape', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await focuskitPage.waitForActiveElement('one');
  await page.keyboard.press('Escape');
  await focuskitPage.waitForActiveElement('group');
  await focuskitPage.waitForTabIndex('group', 0);
});