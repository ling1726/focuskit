import { TrapGroup, List, Commander } from "@focuskit/vanilla";
import { html, render } from "lit-html";

export default function (root: HTMLElement) {
  const example = html`
    <div id="group" tabindex="0">
      <button type="button">Foo</button>
      <div id="list">
        <button type="button">List</button>
        <button type="button">List</button>
        <button type="button">List</button>
      </div>
      <button type="button">Foo</button>
    </div>
  `;

  render(example, root);

  const container = document.getElementById("list") as HTMLElement;
  const trapgroup = document.getElementById("group") as HTMLElement;
  new Commander(document.body);
  new TrapGroup(trapgroup, { id: "trapgroup" });
  new List(container, { id: "test" });
}
