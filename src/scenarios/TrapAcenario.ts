import { Trap } from '../api/Trap';
import { Commander } from '../api/Commander';
import { html, render } from 'lit-html';

export default function (root: HTMLElement) {
  const example = html`
<button type="button" id="enable">Enable trap</button>
<div id="container">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button id="disable" type="button">Disable trap</button>
</div>
<button type="button">Bar</button>
`

  render(example, root);

  const container = document.getElementById('container') as HTMLElement;
  const enable = document.getElementById('enable') as HTMLElement;
  const disable = document.getElementById('disable') as HTMLElement;
  new Commander(document.body);
  const trap = new Trap(container, { id: 'test' });

  enable.addEventListener('click', () => trap.enable());
  disable.addEventListener('click', () => trap.disable());
}
