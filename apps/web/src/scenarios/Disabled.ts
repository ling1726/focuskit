import { List, Commander, Disabled } from "@focuskit/vanilla";
import { html, render } from "lit-html";

export default function (root: HTMLElement) {
  const example = html`
    <div id="disabled">
      <div id="container">
        <button type="button">Foo</button>
        <button type="button">Foo</button>
        <button type="button">Foo</button>
        <button type="button">Foo</button>
        <button type="button">Foo</button>
        <button type="button">Foo</button>
      </div>
    </div>
  `;

  render(example, root);

  const container = document.getElementById("container") as HTMLElement;
  const disabled = document.getElementById("disabled") as HTMLElement;
  new Commander(document.body);
  new Disabled(disabled, { id: "disabled" });
  new List(container, { id: "test" });
}
