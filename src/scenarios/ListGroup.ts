import { ListGroup } from '../api/';
import { Commander } from '../api/Commander';
import { html, render } from 'lit-html';

export default function (root: HTMLElement) {
  const example = html`
<div id="container" tabindex="0">
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
  new ListGroup(container, { id: 'test' });
}


