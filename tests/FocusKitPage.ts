import { Page } from "@playwright/test";
import { TemplateResult } from "lit-html";
import { Readable } from 'stream';
import { render } from '@lit-labs/ssr'

type Key = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' | 'Tab'

export class FocusKitPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  goto() {
    return this.page.goto('.');
  }

  createList(id: string) {
    return this.page.evaluate((id) => {
      const element = document.getElementById(id) as HTMLElement;
      new window.FocusKit.List(element, { id });
    }, id)
  }

  createTrapGroup(id: string) {
    return this.page.evaluate((id) => {
      const element = document.getElementById(id) as HTMLElement;
      new window.FocusKit.TrapGroup(element, { id });
    }, id)
  }

  createCommander() {
    return this.page.evaluate(() => {
      new window.FocusKit.Commander(document.body);
    });
  }

  focus(id: string) {
    return this.page.focus(`#${id}`);
  }

  waitForActiveElement(id: string) {
    return this.page.waitForFunction((id) => document.activeElement?.id === id, id);
  }

  waifForTabIndex(id: string, tabIndex: number) {
    return this.page.waitForFunction(({id, tabIndex}) => document.getElementById(id)?.tabIndex === tabIndex, {id, tabIndex});
  }

  focusableElementIds() {
    return this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('[tabindex="-1"]')).map(el => el.id);
    });
  }

  tabbableElementIds() {
    return this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('[tabindex="0"]')).map(el => el.id);
    });
  }

  async render(template: TemplateResult) {
    const innerHTML = await renderToString(template);
    return this.page.evaluate((innerHTML) => {
      document.body.innerHTML = innerHTML;
    }, innerHTML);
  }
}

function renderToString(template: TemplateResult) {
  const stream = Readable.from(render(template));
  const chunks: Buffer[] = [];
  return new Promise<string>((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}
