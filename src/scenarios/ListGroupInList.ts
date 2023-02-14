import { Commander, List, ListGroup } from '../api';
import { html, render } from 'lit-html';

export default function (root: HTMLElement) {
  const example = html`
  <div id="list">
    <button type="button">List</button>
    <div id="listgroup" tabindex="0">
      <button type="button">ListGroup</button>
      <button type="button">ListGroup</button>
      <button type="button">ListGroup</button>
    </div>
    <button type="button">List</button>
  </div>
</div>
`

  render(example, root);

  const container = document.getElementById('list') as HTMLElement;
  const listgroup = document.getElementById('listgroup') as HTMLElement;
  new Commander(document.body);
  new ListGroup(listgroup, { id: 'listgroup' });
  new List(container, { id: 'list' });

}
