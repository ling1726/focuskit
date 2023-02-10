import { Trap } from '../api/Trap';
import { Commander } from '../api/Commander';

export default function () {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<button type="button">Bar</button>
<div id="container">
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
  <button type="button">Foo</button>
</div>
<button type="button">Bar</button>
`

  const container = document.getElementById('container') as HTMLElement;
  new Commander(document.body);
  new Trap(container, { id: 'test' });

}
