// The owl gate: KIAZAKI's watcher holds the door until the visitor enters.
// Castle3D is built on entry, not behind the gate, so the intro stays light.
(function () {
  const gate = document.getElementById('castleGate');
  const canvas = document.getElementById('castle-canvas');
  const enter = document.querySelector('[data-castle-enter]');
  if (!gate || !canvas) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scene = null;
  let opened = false;

  function start() {
    if (scene || !window.Castle3D) return;
    scene = new window.Castle3D(canvas);
  }

  function open() {
    if (opened) return;
    opened = true;
    start();
    gate.classList.add('is-open');
    gate.setAttribute('aria-hidden', 'true');
    document.body.classList.add('castle-ready');
    window.setTimeout(() => {
      gate.hidden = true;
      canvas.focus({ preventScroll: true });
    }, 900);
  }

  const timer = window.setTimeout(open, reduced ? 900 : 4200);

  enter?.addEventListener('click', (event) => {
    event.stopPropagation();
    window.clearTimeout(timer);
    open();
  });
  gate.addEventListener('click', () => {
    window.clearTimeout(timer);
    open();
  });
  document.addEventListener('keydown', (event) => {
    if (!opened && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      window.clearTimeout(timer);
      open();
    }
  });

  if (reduced) document.documentElement.classList.add('castle-reduced');
})();
