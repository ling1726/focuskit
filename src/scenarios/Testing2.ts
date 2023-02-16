import { List } from "../api/List";
import { Commander } from "../api/Commander";
import { TrapGroup } from "../api/TrapGroup";
import { html, render } from "lit-html";

export default function (root: HTMLElement) {
  const example = html`
    <div class="group" tabindex="0">
      <button>Group 1</button>
      <button>Group 1</button>
      <div class="list">
        <button>List 1</button>
        <button>List 1</button>
        <button>List 1</button>
        <div class="group" tabindex="0">
          <button>Group 3</button>
          <button>Group 3</button>
          <div class="list">
            <button>List 2</button>
            <button>List 2</button>
            <button>List 2</button>
            <div class="group" tabindex="0">
              <button>Group 3</button>
              <button>Group 3</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  render(example, root);

  new Commander(document.body);
  const groups = document.querySelectorAll(".group");
  groups.forEach((group, id) => {
    new TrapGroup(group as HTMLElement, { id });
  });

  const lists = document.querySelectorAll(".list");
  lists.forEach((list, id) => {
    new List(list as HTMLElement, { id });
  });
}
