/* =============================================================
   ROMÁN MOSTEIRO — interacciones del sitio
   Nav flotante, menú móvil, reveal al hacer scroll, formulario.
   ============================================================= */
(function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');

  // Nav: fondo al desplazar
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav__links a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Reveal al entrar en viewport
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => obs.observe(el));
  }

  // Año en el footer
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Formulario de booking -> mailto (sin backend por ahora)
  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nombre = (data.get('nombre') || '').toString().trim();
      const lugar = (data.get('lugar') || '').toString().trim();
      const fecha = (data.get('fecha') || '').toString().trim();
      const mensaje = (data.get('mensaje') || '').toString().trim();
      const subject = encodeURIComponent(`Booking / concierto — ${lugar || 'consulta'}`);
      const body = encodeURIComponent(
        `Nombre / promotora: ${nombre}\nLugar: ${lugar}\nFecha estimada: ${fecha}\n\n${mensaje}`
      );
      window.location.href = `mailto:romanmosteiro@hotmail.com?subject=${subject}&body=${body}`;
      const note = form.querySelector('.form-note');
      if (note) note.textContent = 'Se abrirá tu correo para enviar la solicitud. Gracias.';
    });
  }
})();
