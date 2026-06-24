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

  // Reveal al entrar en viewport (basado en scroll, robusto y sin depender de IO)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pending = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce) {
    pending.forEach(el => el.classList.add('is-in'));
  } else {
    const revealCheck = () => {
      const trigger = window.innerHeight * 0.88;
      pending = pending.filter(el => {
        if (el.getBoundingClientRect().top < trigger) { el.classList.add('is-in'); return false; }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', revealCheck);
        window.removeEventListener('resize', revealCheck);
      }
    };
    window.addEventListener('scroll', revealCheck, { passive: true });
    window.addEventListener('resize', revealCheck, { passive: true });
    revealCheck();
  }

  // Hero: frases flotantes que llegan desde el fondo, controladas por scroll (síncrono, sin rAF)
  const heroTrack = document.querySelector('.hero__track');
  if (heroTrack && !reduce) {
    const floats = [].slice.call(heroTrack.querySelectorAll('.float'));
    const heroPhoto = heroTrack.querySelector('.hero__photo');
    const heroPhotoImg = heroPhoto ? heroPhoto.firstElementChild : null;
    const updateFloats = () => {
      const rect = heroTrack.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      floats.forEach(f => {
        const s = parseFloat(f.getAttribute('data-start')) || 0;
        const e = parseFloat(f.getAttribute('data-end')) || 1;
        f.classList.toggle('is-active', p >= s && p < e);
        f.classList.toggle('is-past', p >= e);
      });
      // La foto de Roman emerge y toma protagonismo segun bajas
      if (heroPhoto) {
        const pp = Math.min(1, Math.max(0, (p - 0.32) / 0.55));
        heroPhoto.style.opacity = pp;
        if (heroPhotoImg) heroPhotoImg.style.transform = 'scale(' + (1.08 - 0.08 * pp).toFixed(3) + ')';
      }
    };
    window.addEventListener('scroll', updateFloats, { passive: true });
    window.addEventListener('resize', updateFloats, { passive: true });
    updateFloats();
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

  // Aviso de cookies (terceros: Spotify / YouTube)
  (function () {
    try { if (localStorage.getItem('rm_cookies') === '1') return; } catch (e) {}
    const bar = document.createElement('div');
    bar.className = 'cookie';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Aviso de cookies');
    bar.innerHTML = '<p>Usamos cookies de terceros solo al reproducir música o vídeos (Spotify, YouTube). <a href="legal.html#cookies">Más información</a>.</p><button class="btn btn--gold" type="button">Aceptar</button>';
    document.body.appendChild(bar);
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('is-in')));
    bar.querySelector('button').addEventListener('click', () => {
      try { localStorage.setItem('rm_cookies', '1'); } catch (e) {}
      bar.classList.remove('is-in');
      setTimeout(() => bar.remove(), 500);
    });
  })();
})();
