# Tema 1
## Introducción a los servicios web REST
# Parte 1
## HTTP y aplicaciones web

---

## Indice

1.  HTTP para sitios web estáticos
2.  HTTP para aplicaciones web
3.  Aplicaciones web en el servidor vs. Single Page Applications


---

# 1. HTTP para sitios web estáticos


---

## Petición/respuesta HTTP

Un servidor web está a la escucha por un **puerto**, aceptando **peticiones** de recursos (p.ej. archivos HTML) y devolviéndolos como **respuestas**

<!-- .element class="stretch" -->
![](img_1a/http.png)

---

## Cómo observar el tráfico HTTP

* En HTTP1 el intercambio de información se hace en **modo texto**. En HTTP2 es **binario**
* Herramientas de desarrollador del navegador 



---

## Petición HTTP

*   Típicamente una petición contiene el **método** (tipo) de petición, la **URL** solicitada y **cabeceras** con información adicional

![](img_1/peticion.png)

En HTTP2 el método y la URL se tratan también como cabeceras

---

## Respuesta HTTP


* Una respuesta contiene un **código de estado**, unas **cabeceras** con información adicional y normalmente los **datos** solicitados por el cliente

![:scale 90%](img_1/respuesta.png)

---

## 1 página = N recursos

Una sola página contiene normalmente múltiples recursos (imágenes, Javascript,...). Cada uno requiere **una transacción HTTP separada** (no en HTTP2 al estar la conexión [multiplexada](https://http2.github.io/faq/#why-is-http2-multiplexed))

![:scale 90%](img_1/recursos.png)

---

## Métodos de petición

*   **GET** solicitar un recurso 
*   **POST** enviar datos al servidor
*   **PUT** actualizar recurso, **DELETE**: eliminar recurso
    * No permitidos en la mayoría de recursos por motivos evidentes
    * Los navegadores no los usan en la navegación "normal", se necesita Javascript para lanzar estos métodos

---

## Códigos de estado

Diferentes rangos numéricos indican distintos tipos de resultados
*   1xx _informational_
*   2xx _success_ (p.ej. `200 OK`)
*   3xx _redirection_ (p. ej. `301 MOVED PERMANENTLY`)
*   4xx _client error_ (p. ej. `404 NOT FOUND`, `400 BAD REQUEST`, `403 FORBIDDEN`, [418 I’M A TEAPOT](http://tools.ietf.org/html/rfc2324) :) )
*   5xx server error

Consultar más en [http://httpstatus.es](http://httpstatus.es)

En la actualidad la mayoría son ignorados por el navegador, que se limita a mostrar el cuerpo de la respuesta.

---

## HTTP es un protocolo sin estado

*   No se guardan datos permanentes entre una petición/respuesta y la siguiente
*   Sin embargo, se debería recordar si nos hemos autentificado, qué contiene nuestro carrito de la compra, etc...
*   Ya veremos soluciones a este "dilema"

![](img_1/xkcd.png)

[http://xkcd.com/869/](http://xkcd.com/869/)

---

# 1.2 HTTP básico para aplicaciones web

---

## Aplicaciones web y HTTP

*   Una aplicación web es una **colección de "programitas"** o "rutinas". A cada uno se accede a través de una URL
*   La comunicación con las rutinas se hace a través de **HTTP**
    *   Una petición GET ya no significa "devuelve un recurso", sino **"ejecuta un programa y devuelve el resultado"**
    *   El código de estado se puede interpretar como el **resultado de la ejecución**. p. ej, un 500 se debe a que el programa ha abortado
*   Al igual que en línea de comandos podemos pasar **parámetros**

---

## Aplicación web para consultar notas

![](img_1/app_web.png)

---

## GET vs. POST

*   En aplicaciones "clásicas" **tienen la misma semántica**, ejecutar un programa remoto pasándole datos en forma `parametro=valor&parametro2=valor2...`
*   Algunas diferencias "prácticas"
    *   Los parámetros en GET se ven en la barra de direcciones del navegador
    *   Los parámetros en POST tienen longitud ilimitada

---

## ¿De dónde salen los parámetros?

```html
<form action="login.php" method="post">Usuario: <input type="text" name="login">
Contraseña: <input type="password" name="password">
<input type="submit" value="Entrar">
```


---

## Plantillas HTML en el servidor

*   Facilitan la tarea de generar HTML dinámicamente, ya que generar todo el HTML a base de "printfs" sería engorroso
*   Mezclan bloques de HTML con sentencias de un lenguaje de programación o con instrucciones especiales de control de flujo

---

## PHP

![](img_1/php.png)


---

## Javascript

*   El código se descarga junto con el HTML y se interpreta en el navegador **después de** la petición/respuesta HTTP
*   Inicialmente se usaba para pequeños cálculos, validación de formularios, [efectos absurdos](http://www.javascript-fx.com/mouse_trail/pinwheel/demo.html)

![](img_1/js.png)


---

## Frontend vs. Backend

Con Javascript aparece el mundo del _desarrollo frontend_

![](img_1/front_vs_back.png)

Charla: ["Picking a Technology Stack"](https://docs.google.com/presentation/d/1pA6reUNKqkfupSogZB4Q42Tk98VAq_loqkIDE-HSxAE/present#slide=id.p), Pamela Fox

---

## Arquitectura "clásica"

![](img_1/app_clasica.png)

.cita[Charla: [The New Application Architectures](http://www.infoq.com/presentations/SpringOne-2GX-2012-Keynote-2), Adrian Colyer]

---


# 3 Aplicaciones web "modernas"

---

## AJAX

Varias tecnologías (sobre todo JS) que permiten **hacer peticiones al servidor sin cambiar de URL, y refrescar solo parte de la página**

Omnipresente en la actualidad. Salvo las webs estáticas prácticamente **todo es AJAX**

---

background-image:url(img_1/AJAX_vs_NO.png)

---

## El Backend es un API para el frontend

Gracias a AJAX y a Javascript nos podemos llevar **casi todo el código de la aplicación al navegador**, convirtiendo el servidor en un **API remoto** para guardar/recuperar datos

![:scale 70%](img_1/modern_webapp.png)

---

## Single Page Applications

La aplicación es **un único .HTML** y los cambios en la interfaz se hacen dinámicamente gracias al JS, no navegando a otras páginas


---

## Ventajas de las SPA (I)

* Una SPA proporciona una *experiencia de usuario* mucho más cercana a una app nativa que la web "tradicional"

---

## Ventajas de las SPA (II)

* Al extraer la interfaz y gran parte de la lógica al *frontend* el *backend* se puede reutilizar para otros clientes (app móvil, escritorio, integración...)

![:scale 50%](img_1/linkedin_services.png)

---

## Problemas de las SPA

**SEO**: los robots no pueden indexar el contenido, ya que se genera dinámicamente

La **carga inicial** del sitio es mucho más lenta. Gran problema en móviles

![:scale 50%](img_1/spa_speed.png)


---

En 2010 Twitter cambió su arquitectura *frontend*, desplazando el UI y la lógica al cliente, con Javascript

>> [...] we discovered that the raw parsing and execution of JavaScript caused massive outliers in perceived rendering speed. In our fully client-side architecture, you don’t see anything until our JavaScript is downloaded and executed. The problem is further exacerbated if you do not have a high-specification machine or if you’re running an older browser. The bottom line is that a client-side architecture leads to slower performance [...]

[Referencia](https://blog.twitter.com/2012/improving-performance-on-twittercom)


---

## Rendering "híbrido"

La carga inicial se *renderiza* desde el servidor. Una vez se ha cargado el contenido, la interacción con contenido nuevo se hace al estilo SPA

![:scale 60%](img_1/hybrid_rendering.png)


---


