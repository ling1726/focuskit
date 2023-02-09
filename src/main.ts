import { ArrowZone } from './api/ArrowZone';
import { Commander } from './api/Commander';
import './style.css'

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

const container = document.getElementById('container')  as HTMLElement;
new Commander(document.body);
new ArrowZone(container, { id: 'test' });

