import { List } from '../api/List';
import { Commander } from '../api/Commander';
import { html, render } from 'lit-html';

export default function (root: HTMLElement) {
  const example = html`
<div id="container">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
</div>
  `

  render(example, root);

  const container = document.getElementById('container') as HTMLElement;
  new Commander(document.body);
  new List(container, { id: 'test' });
}


