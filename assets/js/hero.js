/* =============================================================
   HERO · La Travesía  (concha de Santiago vectorial, scroll-driven)
   En carga: la concha aparece dibujada sobre la noche atlántica con
   el lema (nunca pantalla en negro). Al hacer scroll se abre y se
   convierte en el amanecer del Pacífico (costillas -> rayos de sol)
   y se revela la web. Todo vectores = fluido y ligero.
   ============================================================= */
(function () {
  const hero = document.querySelector('.hero');
  const svg = document.querySelector('.hero__shell');
  if (!hero || !svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cx = 500, cy = 660, N = 13, aMax = 82 * Math.PI / 180, L = 430;
  const ribsG = svg.querySelector('#ribs');
  const body = svg.querySelector('#shellBody');
  const sun = svg.querySelector('#sun');
  const glow = svg.querySelector('#glow');
  const shell = svg.querySelector('#shell');

  const lema = document.querySelector('.hero__lema');
  const reveal = document.querySelector('.hero__reveal');
  const cue = document.querySelector('.hero__scroll');
  const dawn = document.querySelector('.hero__sky--dawn');

  // ---- Cuerpo de la concha (abanico festoneado) ----
  let d = `M ${cx} ${cy} `;
  const steps = 170;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const a = -aMax + t * 2 * aMax;
    const sc = 1 - 0.05 * Math.abs(Math.sin(t * (N - 1) * Math.PI));
    const r = L * sc;
    d += `L ${(cx + r * Math.sin(a)).toFixed(1)} ${(cy - r * Math.cos(a)).toFixed(1)} `;
  }
  d += 'Z';
  body.setAttribute('d', d);

  // ---- Costillas (dibujadas desde el inicio; serán rayos) ----
  const ribs = [];
  for (let i = 0; i < N; i++) {
    const a = -aMax + i * (2 * aMax / (N - 1));
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', (cx + L * 0.97 * Math.sin(a)).toFixed(1));
    line.setAttribute('y2', (cy - L * 0.97 * Math.cos(a)).toFixed(1));
    line.setAttribute('class', 'rib');
    ribsG.appendChild(line);
    ribs.push(line);
  }

  function finalState() {
    body.style.opacity = 1;
    if (dawn) dawn.style.opacity = 1;
    svg.style.opacity = 1;
    svg.style.color = '#f4cd78';
    sun.setAttribute('r', 178); sun.style.opacity = 1;
    glow.style.opacity = 1;
    shell.style.transformOrigin = '500px 660px';
    shell.setAttribute('transform', 'translate(0,-26) scale(1.18)');
    if (lema) lema.style.opacity = 0;
    if (reveal) { reveal.style.opacity = 1; reveal.style.transform = 'none'; }
    if (cue) cue.style.opacity = 0;
  }

  // Sin animación: estado final bonito (amanecer + nombre)
  if (reduce || !window.gsap || !window.ScrollTrigger) { finalState(); return; }

  gsap.registerPlugin(ScrollTrigger);

  // ESTADO INICIAL VISIBLE: concha plateada sobre la noche + lema
  svg.style.color = '#aac2e2';
  gsap.set(shell, { svgOrigin: '500 660', scale: 0.96 });
  gsap.set(sun, { attr: { r: 0 }, opacity: 0 });
  gsap.set(glow, { opacity: 0 });
  gsap.set(dawn, { opacity: 0 });
  gsap.set(body, { opacity: 1 });
  gsap.set(lema, { opacity: 1 });
  gsap.set(cue, { opacity: 1 });
  gsap.set(reveal, { opacity: 0, y: 24 });

  // La concha y el lema son visibles desde la carga: no dependen de
  // ninguna animación de entrada, así el hero nunca queda en negro.

  // SCROLL: amanece, sale el sol, se abre y se revela la web
  const tl = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.5 }
  });
  tl.to(dawn, { opacity: 1, duration: 0.45 }, 0.0)
    .to(svg, { color: '#f4cd78', duration: 0.45 }, 0.0)
    .to(sun, { attr: { r: 178 }, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.04)
    .to(glow, { opacity: 1, duration: 0.45 }, 0.04)
    .to(shell, { scale: 1.16, y: -24, duration: 0.6, ease: 'power1.inOut' }, 0.0)
    .to(lema, { opacity: 0, duration: 0.2 }, 0.26)
    .to(shell, { scale: 1.3, duration: 0.34, ease: 'power1.out' }, 0.6)
    .to(reveal, { opacity: 1, y: 0, duration: 0.34, ease: 'power3.out' }, 0.58)
    .to(cue, { opacity: 0, duration: 0.12 }, 0.5);

  requestAnimationFrame(() => ScrollTrigger.refresh());
})();
