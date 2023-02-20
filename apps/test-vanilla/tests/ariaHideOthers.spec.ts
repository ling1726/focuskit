import { expect, test } from '@playwright/test';
import { html } from 'lit-html';
import { FocusKitPage } from './FocusKitPage.js';

test('should add `aria-hidden to top level parents', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);

  await focuskitPage.goto();
  await focuskitPage.render(html`
  <div>
    <div id="hidden-1">
      <div>Hidden</div>
      <div>Hidden</div>
      <div>Hidden</div>
    </div>
    <div id="visible">Visible</div>
    <div id="hidden-2">
      <div>Hidden</div>
      <div>Hidden</div>
      <div>Hidden</div>
    </div>
  </div>
  `);

  await page.evaluate(() => {
    const visible = document.getElementById('visible')!;
    window.FocusKit.ariaHideOthers(visible);
  });

  await page.waitForSelector('#hidden-1[aria-hidden="true"]');
  await page.waitForSelector('#hidden-2[aria-hidden="true"]');
  const hiddenCount = await page.evaluate(() => document.querySelectorAll('[aria-hidden]').length)
  expect(hiddenCount).toBe(2);

  const visible = await page.waitForSelector('#visible');
  expect(await visible.getAttribute('aria-hidden')).toBe(null);
});

test('should return hidden elements', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);

  await focuskitPage.goto();
  await focuskitPage.render(html`
  <div>
    <div id="hidden-1">
      <div>Hidden</div>
      <div>Hidden</div>
      <div>Hidden</div>
    </div>
    <div id="visible">Visible</div>
    <div id="hidden-2">
      <div>Hidden</div>
      <div>Hidden</div>
      <div>Hidden</div>
    </div>
  </div>
  `);

  const hiddenElementIds = await page.evaluate(() => {
    const visible = document.getElementById('visible')!;
    const hidden = window.FocusKit.ariaHideOthers(visible);
    return hidden.map(x => x.id);
  });

  expect(hiddenElementIds).toEqual(['hidden-1', 'hidden-2']);
});
