import { List } from '../api/List';
import { Commander } from '../api/Commander';
import { TrapGroup } from '../api/TrapGroup';

export default function () {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="container">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <div tabindex="0" id="trapgroup" class="trapgroup">
    <button type="button">Foo</button>
    <button type="button">Foo</button>
  </div>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
</div>
`

  const container = document.getElementById('container') as HTMLElement;
  const trapgroup = document.getElementById('trapgroup') as HTMLElement;
  new Commander(document.body);
  new TrapGroup(trapgroup, { id: 'trapgroup' });
  new List(container, { id: 'test' });

}


