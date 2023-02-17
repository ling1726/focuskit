import { TrapGroup, Commander } from "@focuskit/vanilla";
import { html, render } from "lit-html";

export default function (root: HTMLElement) {
  const example = html`
    <div id="group-1" class="group" tabindex="0">
      <button>Group 1</button>
      <button>Group 1</button>
      <div id="group-1-1" class="group" tabindex="0">
        <button>Group 1-1</button>
        <button>Group 1-1</button>
        <div id="group-1-1-1" class="group" tabindex="0">
          <button>Group 1-1-1</button>
          <button>Group 1-1-1</button>
        </div>
      </div>
      <div id="group-1-2" class="group" tabindex="0">
        <button>Group 1-2</button>
        <button>Group 1-2</button>
      </div>
    </div>
    <div id="group-2" class="group" tabindex="0">
      <button>Group 2</button>
      <button>Group 2</button>
    </div>
  `;

  render(example, root);

  new Commander(document.body);
  const groups = document.querySelectorAll(".group");
  groups.forEach((group, id) => {
    new TrapGroup(group as HTMLElement, { id });
  });
}
