/* =============================================================
   HERO · La Travesía  (concha de Santiago vectorial, scroll-driven)
   La concha se dibuja sobre la noche atlántica y, al hacer scroll,
   se abre y se convierte en el amanecer del Pacífico: las costillas
   se vuelven rayos de sol y la web se revela. Todo en vectores =
   fluido y ligero. "Algo que se convierte en él".
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

  // ---- Construir el cuerpo de la concha (abanico con borde festoneado) ----
  let d = `M ${cx} ${cy} `;
  const steps = 170;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const a = -aMax + t * 2 * aMax;
    const scallop = 1 - 0.05 * Math.abs(Math.sin(t * (N - 1) * Math.PI));
    const r = L * scallop;
    d += `L ${(cx + r * Math.sin(a)).toFixed(1)} ${(cy - r * Math.cos(a)).toFixed(1)} `;
  }
  d += 'Z';
  body.setAttribute('d', d);

  // ---- Costillas (que luego serán rayos) ----
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
    const len = L * 0.97;
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    ribs.push(line);
  }

  function finalState() {
    ribs.forEach(l => { l.style.strokeDashoffset = 0; });
    body.style.opacity = 1;
    if (dawn) dawn.style.opacity = 1;
    svg.style.color = '#f4cd78';
    sun.setAttribute('r', 178); sun.style.opacity = 1;
    glow.style.opacity = 1;
    shell.setAttribute('transform', 'translate(0,-26) scale(1.18)');
    shell.style.transformOrigin = '500px 660px';
    if (lema) lema.style.opacity = 0;
    if (reveal) { reveal.style.opacity = 1; reveal.style.transform = 'none'; }
    if (cue) cue.style.opacity = 0;
  }

  // Sin animación: estado final bonito (amanecer + nombre)
  if (reduce || !window.gsap || !window.ScrollTrigger) { finalState(); return; }

  gsap.registerPlugin(ScrollTrigger);

  // Estado inicial: noche, concha sin dibujar, sol apagado
  svg.style.color = '#9fb6d8';
  gsap.set(shell, { svgOrigin: '500 660', scale: 0.9 });
  gsap.set(body, { opacity: 0 });
  gsap.set(sun, { attr: { r: 0 }, opacity: 0 });
  gsap.set(glow, { opacity: 0 });
  gsap.set(dawn, { opacity: 0 });
  gsap.set(reveal, { opacity: 0, y: 24 });
  gsap.set(cue, { opacity: 1 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.5 }
  });

  // Fase 1 — se dibuja la concha sobre la noche
  tl.to(body, { opacity: 1, duration: 0.16 }, 0.02)
    .to(ribs, { strokeDashoffset: 0, duration: 0.3, stagger: { each: 0.014, from: 'center' } }, 0.03)
    .to(lema, { opacity: 1, duration: 0.12 }, 0.05)
    // Fase 2 — amanece: la concha se convierte en sol
    .to(dawn, { opacity: 1, duration: 0.42 }, 0.30)
    .to(svg, { color: '#f4cd78', duration: 0.42 }, 0.32)
    .to(sun, { attr: { r: 178 }, opacity: 1, duration: 0.42, ease: 'power2.out' }, 0.34)
    .to(glow, { opacity: 1, duration: 0.42 }, 0.34)
    .to(shell, { scale: 1.16, y: -26, duration: 0.55, ease: 'power1.inOut' }, 0.30)
    .to(lema, { opacity: 0, duration: 0.14 }, 0.50)
    // Fase 3 — se abre y se revela la web
    .to(shell, { scale: 1.3, duration: 0.32, ease: 'power1.out' }, 0.66)
    .to(reveal, { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out' }, 0.66)
    .to(cue, { opacity: 0, duration: 0.1 }, 0.7);

  requestAnimationFrame(() => ScrollTrigger.refresh());
})();
