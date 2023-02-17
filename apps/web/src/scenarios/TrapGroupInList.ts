import { TrapGroup, List, Commander } from "@focuskit/vanilla";
import { html, render } from "lit-html";

export default function (root: HTMLElement) {
  const example = html`
    <div id="container">
      <button type="button">List</button>
      <button type="button">List</button>
      <div tabindex="0" id="trapgroup" class="trapgroup">
        <button type="button">Group</button>
        <button type="button">Group</button>
      </div>
      <button type="button">List</button>
      <button type="button">List</button>
    </div>
  `;

  render(example, root);

  const container = document.getElementById("container") as HTMLElement;
  const trapgroup = document.getElementById("trapgroup") as HTMLElement;
  new Commander(document.body);
  new TrapGroup(trapgroup, { id: "trapgroup" });
  new List(container, { id: "test" });
}
