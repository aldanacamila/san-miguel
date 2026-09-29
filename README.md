# Portal Municipalidad de San Miguel

Sitio estático (HTML + Bootstrap 5.3 + JS vanilla). No requiere build: abrir `index.html` o usar
`npx serve .` / la extensión Live Server.

## Estructura

```
index.html        Home (versión normal + Modo Simple)
tramite.html      Detalle de trámite/servicio (?titulo=...&texto=...)
juego.html        Juego "Aprendé a usar las apps" (intro → preguntas → resultado)
css/styles.css    Tema y ajustes sobre Bootstrap (variables, navbar, secciones, footer, alto contraste, modo simple)
assets/           Logo (msmlogo-circulo.svg) y mascota (miguel_bot.png)
js/utils.js       Helpers compartidos (SM.esc, SM.storage, SM.irATramite, SM.hablar)
js/data.js        TODO el contenido editable (menú, programas, eventos, novedades, emergencias, preguntas)
js/components.js  Navbar, barra de accesibilidad, footer, flotantes, tabbar + despachador de [data-action]
js/accesibilidad.js  Tamaño de letra, alto contraste, Modo Simple, tema claro/oscuro
js/asistente.js   Asistente de voz (reglas de comandos en el array `reglas`)
js/home.js        Renderiza la home desde data.js
js/tramite.js     Lógica de tramite.html
js/juego.js       Lógica de juego.html
```

## Convenciones
- Sin `onclick` inline: los botones usan `data-action="..."` y se resuelven en `components.js`.
- Contenido → `data.js`. Estilos → `styles.css`. Lógica → un archivo JS por responsabilidad.
- Todo el JS cuelga del namespace `SM`. Orden de carga: utils → data → components → accesibilidad → asistente → script de la página.
- Para agregar una página: copiar `tramite.html`, dejar los 3 contenedores `app-*` y los scripts comunes.

- Íconos: Google Material Symbols (Outlined). En data.js el campo `ic` es el nombre del ícono (fonts.google.com/icons). No usar emojis.
- Contenedores de programas: para agregar uno, sumar un objeto a `SM.programas` en data.js (`c` = color del bloque).
- Eventos: `SM.eventos` en data.js alimenta el carrusel (los actuales son de ejemplo).
