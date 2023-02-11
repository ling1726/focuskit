import { List } from '../api/List';
import { Commander } from '../api/Commander';

export default function () {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="container">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
</div>
`

  const container = document.getElementById('container') as HTMLElement;
  new Commander(document.body);
  new List(container, { id: 'test' });

}


