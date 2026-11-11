// The Vault viewer: opens a frame, steps with ← →, closes with Esc or a click
// outside. Deep links such as /vault/#stills-01 open the frame on arrival.
(function () {
  const lb = document.getElementById('vaultLightbox');
  if (!lb) return;

  const items = [...document.querySelectorAll('[data-vault-open]')];
  const img = document.getElementById('vaultImg');
  const cap = document.getElementById('vaultCap');
  const num = document.getElementById('vaultNum');
  const closeBtn = document.getElementById('vaultClose');
  const prevBtn = document.getElementById('vaultPrev');
  const nextBtn = document.getElementById('vaultNext');
  let at = 0;
  let returnTo = null;
  let closeTimer = 0;

  const pad = (n) => String(n).padStart(2, '0');

  function show(i) {
    at = (i + items.length) % items.length;
    const button = items[at];
    const thumb = button.querySelector('img');
    img.src = button.dataset.full || '';
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = button.dataset.caption || '';
    num.textContent = `${pad(at + 1)} / ${pad(items.length)}`;
    for (const k of [at - 1, at + 1]) {
      const near = items[(k + items.length) % items.length];
      if (near && near.dataset.full) {
        const pre = new Image();
        pre.src = near.dataset.full;
      }
    }
  }

  function open(i) {
    clearTimeout(closeTimer);
    returnTo = document.activeElement;
    show(i);
    lb.hidden = false;
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-lb');
    requestAnimationFrame(() => lb.classList.add('is-open'));
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (lb.hidden) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-lb');
    if (location.hash) history.replaceState(null, '', location.pathname);
    closeTimer = window.setTimeout(() => { lb.hidden = true; }, 220);
    if (returnTo && returnTo.focus) returnTo.focus({ preventScroll: true });
  }

  items.forEach((button, i) => button.addEventListener('click', () => open(i)));
  prevBtn.addEventListener('click', () => show(at - 1));
  nextBtn.addEventListener('click', () => show(at + 1));
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
  });

  // A link from the home page lands on a frame and opens it straight away.
  const hash = location.hash.replace('#', '');
  if (hash) {
    const found = items.findIndex((button) => button.closest('figure')?.id === hash);
    if (found >= 0) window.setTimeout(() => open(found), 260);
  }
})();
