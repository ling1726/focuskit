import './style.css'
import { Zone } from './zone';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="container-1">
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
</div>
<div id="container-2">
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
</div>
<div id="container-3">
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
  <button>Foo</button>
</div>
<button id="delete">delete</button>
`

const container1 = document.getElementById('container-1')  as HTMLElement;
const container2 = document.getElementById('container-2')  as HTMLElement;
const container3 = document.getElementById('container-3')  as HTMLElement;
const zone1 = new Zone(container1);
const zone2 = new Zone(container2);
const zone3 = new Zone(container3);

const deleteButton = document.getElementById('delete') as HTMLElement;
deleteButton.addEventListener('click', () => {
  zone2.dispose();
  container2.remove();
})

