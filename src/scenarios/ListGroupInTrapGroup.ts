import { ListGroup } from '../api/ListGroup';
import { Commander } from '../api/Commander';
import { TrapGroup } from '../api/TrapGroup';
import { html, render } from 'lit-html';

export default function (root: HTMLElement) {
  const example = html`
<div id="group" tabindex="0">
  <button type="button">Foo</button>
  <div id="list" tabindex="0">
    <button type="button">ListGroup</button>
    <button type="button">ListGroup</button>
    <button type="button">ListGroup</button>
  </div>
  <button type="button">Foo</button>
</div>
`

  render(example, root);

  const container = document.getElementById('list') as HTMLElement;
  const trapgroup = document.getElementById('group') as HTMLElement;
  new Commander(document.body);
  new TrapGroup(trapgroup, { id: 'trapgroup' });
  new ListGroup(container, { id: 'test' });
}
