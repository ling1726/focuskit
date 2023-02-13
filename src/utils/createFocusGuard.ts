const guardStyles = {
  width: '1px',
  height: '0px',
  padding: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: '1px',
  left: '1px',
};


export function creaetFocusGuard() {
  const guard = document.createElement('div');
  guard.tabIndex = 0;
  Object.assign(guard.style, guardStyles);
  return guard;
}