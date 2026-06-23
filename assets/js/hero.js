/* =============================================================
   HERO · La Travesía  (vídeo scrubbeado por scroll)
   Empezamos en el mar y, al hacer scroll, el vídeo "corre"
   acercándose hasta dejar a Román en primer plano en la playa.
   El mar es el "algo" que se convierte en él.
   ============================================================= */
(function () {
  const hero = document.querySelector('.hero');
  const video = document.querySelector('.hero__film');
  if (!hero || !video) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lema = document.querySelector('.hero__lema');
  const reveal = document.querySelector('.hero__reveal');
  const cue = document.querySelector('.hero__scroll');

  function setOverlay(p) {
    if (lema) lema.style.opacity = p < 0.04 ? (p / 0.04) : Math.max(0, 1 - Math.max(0, p - 0.12) / 0.16);
    if (reveal) {
      const r = Math.max(0, Math.min(1, (p - 0.6) / 0.3));
      reveal.style.opacity = r;
      reveal.style.transform = 'translateY(' + ((1 - r) * 22) + 'px)';
    }
    if (cue) cue.style.opacity = p < 0.85 ? (1 - p / 0.85) : 0;
  }

  // Movimiento reducido: foto fija (último fotograma) + nombre visible
  if (reduce) {
    video.removeAttribute('autoplay');
    video.pause();
    const showEnd = () => { try { video.currentTime = (video.duration || 5) - 0.05; } catch (e) {} };
    if (video.readyState >= 1) showEnd(); else video.addEventListener('loadedmetadata', showEnd);
    if (reveal) { reveal.style.opacity = 1; reveal.style.transform = 'none'; }
    if (lema) lema.style.opacity = 0;
    if (cue) cue.style.opacity = 0;
    return;
  }

  video.pause();
  let dur = 0, ready = false;
  const onMeta = () => { dur = video.duration || 5; ready = true; };
  if (video.readyState >= 1) onMeta(); else video.addEventListener('loadedmetadata', onMeta);

  let targetT = 0, curT = 0, ticking = false;
  function renderFrame() {
    curT += (targetT - curT) * 0.18;
    if (ready && dur && Math.abs(curT - video.currentTime) > 0.015) {
      try { video.currentTime = curT; } catch (e) {}
    }
    if (Math.abs(targetT - curT) > 0.01) { requestAnimationFrame(renderFrame); }
    else { ticking = false; }
  }
  function seek(p) {
    if (!ready || !dur) return;
    targetT = Math.min(dur - 0.05, Math.max(0, p * dur));
    if (!ticking) { ticking = true; requestAnimationFrame(renderFrame); }
  }

  function init() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.3,
        onUpdate: (self) => { seek(self.progress); setOverlay(self.progress); }
      });
      setOverlay(0);
    } else {
      const onScroll = () => {
        const total = hero.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / total)) : 0;
        seek(p); setOverlay(p);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
