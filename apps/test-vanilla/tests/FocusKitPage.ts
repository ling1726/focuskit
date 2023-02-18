import { Page } from "@playwright/test";
import { TemplateResult } from "lit-html";
import { Readable } from "stream";
import { render } from "@lit-labs/ssr";

export class FocusKitPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  goto() {
    return this.page.goto(".");
  }

  createList(id: string) {
    return this.page.evaluate((id) => {
      const element = document.getElementById(id) as HTMLElement;
      new window.FocusKit.List(element, { id });
    }, id);
  }

  createListGroup(id: string) {
    return this.page.evaluate((id) => {
      const element = document.getElementById(id) as HTMLElement;
      new window.FocusKit.ListGroup(element, { id });
    }, id);
  }

  createTrapGroup(id: string) {
    return this.page.evaluate((id) => {
      const element = document.getElementById(id) as HTMLElement;
      new window.FocusKit.TrapGroup(element, { id });
    }, id);
  }

  async createTrap(id: string) {
    await this.page.evaluate((id) => {
      const element = document.getElementById(id) as HTMLElement;
      element._trap = new window.FocusKit.Trap(element, { id });
    }, id);

    return {
      enable: async () =>
        await this.page.evaluate((id) => {
          const element = document.getElementById(id) as HTMLElement;
          if (!element._trap) {
            throw new Error(`Element ${id} does not have a trap`);
          }

          element._trap.active = true;
        }, id),
      disable: async () =>
        await this.page.evaluate((id) => {
          const element = document.getElementById(id) as HTMLElement;
          if (!element._trap) {
            throw new Error(`Element ${id} does not have a trap`);
          }

          element._trap.active = false;
        }, id),
    };
  }

  createCommander() {
    return this.page.evaluate(() => {
      new window.FocusKit.Commander(document.body);
    });
  }

  focus(id: string) {
    return this.page.focus(`#${id}`);
  }

  async waitForActiveElement(id: string, options: { timeout?: number } = {}) {
    const { timeout = 1000 } = options;
    try {
      await this.page.waitForFunction(
        (id) => document.activeElement?.id === id,
        id,
        { timeout }
      );
    } catch {
      const activeElementId = await this.page.evaluate(
        () => document.activeElement?.id
      );
      throw new Error(
        `Expected active element to be: ${id}, got: ${activeElementId}`
      );
    }
  }

  async waitForTabIndex(
    id: string,
    tabIndex: number,
    options: { timeout?: 1000 } = {}
  ) {
    const { timeout = 1000 } = options;
    try {
      await this.page.waitForFunction(
        ({ id, tabIndex }) =>
          document.getElementById(id)?.tabIndex === tabIndex,
        { id, tabIndex },
        { timeout }
      );
    } catch {
      const actualTabIndex = await this.page.evaluate(
        () => document.getElementById(id)?.tabIndex
      );
      throw new Error(
        `Expected tabIndex of ${id} to be: ${tabIndex}, got: ${actualTabIndex}`
      );
    }
  }

  async waitForTabIndexes(
    ids: string[],
    tabIndex: number,
    options: { timeout?: 1000 } = {}
  ) {
    const { timeout = 1000 } = options;
    try {
      await this.page.waitForFunction(
        ({ ids, tabIndex }) => {
          return ids.reduce((prev, cur) => {
            return prev && document.getElementById(cur)?.tabIndex === tabIndex;
          }, true);
        },
        { ids, tabIndex },
        { timeout }
      );
    } catch {
      const actualTabIndexes = await this.page.evaluate((ids) => {
        const res: Record<string, number | undefined> = {};
        for (const id of ids) {
          const el = document.getElementById(id);
          res[id] = el?.tabIndex;
        }

        return res;
      }, ids);

      for (const id of ids) {
        if (actualTabIndexes[id] !== tabIndex) {
          console.error(
            "Expected",
            id,
            "tabIndex to be:",
            tabIndex,
            "but got:",
            actualTabIndexes[id]
          );
        }
      }

      throw new Error(
        "Some tabIndexes were not expected, please check logs for details"
      );
    }
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
    stream.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
