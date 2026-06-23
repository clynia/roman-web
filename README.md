# Román Mosteiro — Web oficial

Sitio oficial de **Román Mosteiro**, cantautor gallego. Del Atlántico al Pacífico:
**PaZífico**, su homenaje a José Alfredo Jiménez grabado en la costa de Jalisco (México)
con Viva Music Group.

Sitio estático (HTML, CSS y JavaScript, sin framework), mobile-first.

## Hero · La Travesía
El hero es un **vídeo scrubbeado por scroll**: empieza en el mar abierto y, al bajar,
la cámara se acerca hasta dejar a Román en primer plano en la orilla. Construido con
GSAP ScrollTrigger; respeta `prefers-reduced-motion`.

## Estructura
```
index.html              Página principal (one-pager inmersivo)
assets/css/styles.css   Sistema visual (del Atlántico de noche al amanecer del Pacífico)
assets/js/hero.js       Motor del hero (scroll-scrub del vídeo)
assets/js/main.js       Nav, menú móvil, reveals, formulario de booking
assets/img/             Imágenes y vídeo del hero
```

## Desarrollo local
```bash
python -m http.server 5520
# abrir http://localhost:5520
```

## Despliegue
Hosting estático. Subir el contenido de esta carpeta a la raíz web.
