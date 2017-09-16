<!-- .slide: class="titulo" -->

# Tema 1
## Introducción a los servicios web REST
# Parte 3
## Diseño de APIs REST

---

## Contenidos

1. REST en detalle
2. Buenas prácticas en el diseño de APIs REST
3. Cuestiones técnicas

---

<!-- .slide: class="titulo" -->

# 1. REST en detalle

---

## REST Formalmente

Tiene su origen en [la tesis](www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) de [Roy Fielding](https://twitter.com/fielding),e implica 6 condiciones:

*   Cliente-servidor
*   Interfaz uniforme
    *   Identificación de los recursos
    *   Representaciones estándar
    *   Mensajes auto-descriptivos
    *   Hypermedia as The Engine of The Application State (HATEOAS)
*   Sin estado
*   Cacheable
*   Capas (proxys de modo transparente)
*   Código "bajo demanda" (opcional)

![](img_1c/roy_fielding.png)
<!-- .element: class="right_vertical_center" -->

---

## Resumen de REST bajo HTTP

Las **llamadas al API** se implementan como **peticiones HTTP**, en las que:

*   La **URL** representa el *recurso*
*   El **método HTTP** representa la *operación*
*   El **código de estado HTTP** representa el *resultado*
*   Como **formato de intercambio de datos** usaremos algún estándar ampliamente difundido (normalmente JSON por legibilidad y facilidad de manejo desde Javascript)

---

## Leer recurso

- Habitualmente **todos los recursos de un tipo** se representan con una URL con el nombre del tipo en plural

```http
https://api.github.com/users/
http://graph.facebook.com/me/photos
```

- La URL de **un recurso concreto** debe ser única. Normalmente se obtiene concatenando a la de todos los recursos el `id` del recurso referenciado.

```http
https://api.github.com/users/octocat
http://graph.facebook.com/me/photos/11000003455
```

---

## Resultado de leer recurso

- **Algunos estados** posibles: **200** (se devuelve el recurso), **404** (el recurso con dicho `id` no existe),  **403** (acceso prohibido), **500** (Error del servidor, p.ej. se ha caído la BD)
- La cabecera `Content-Type` especifica el tipo MIME del formato de datos que se está usando

```http
200 OK
Content-Type:application/json

{
  "login": "octocat",
  "id": 583231,
  "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=3",
  ...
}
```


---

## Crear recursos

- En general, la URL estará "abierta", apuntando a la colección de recursos, ya que el nuevo recurso todavía no tiene un `id` (típicamente lo asigna el sistema, casi siempre la BD)

```http
http://api.ua.es/asignaturas/ADI_34039/anuncios
http://api.change.org/peticiones/2/firmas
```

- El método debe ser **POST** 

- Se envía el nuevo recurso en el cuerpo de la petición

```http
POST http://api.ua.es/asignaturas/ADI_34039/anuncios HTTP/1.0

{ "caducidad":"2017-12-28", 
"autor":"otto@ua.es", 
"texto":"mañana no hay clase de teoría" }
```

---


## Crear recurso con _id_ conocido

Igual que antes, pero

- La **URL** incluirá el `id`

```http
http://api.ua.es/alumnos/123456J
http://api.biblioteca.ua.es/libros/978-3-16-148410-0
```

- El método debe ser **PUT**


---


## Crear recurso: resultado

- **Estados** posibles: **201** (Recurso creado correctamente), **403** (acceso prohibido), **400** (petición incorrecta, p.ej. falta un campo o su valor no es válido), **500** (Error del servidor, p.ej. se ha caído la BD)

- Lo más "ortodoxo" es **devolver la URL del recurso recién creado** como valor de la cabecera HTTP `Location` de la respuesta

```http
201 CREATED HTTP/1.1
Location: http://api.ua.es/asignaturas/ADI_3409/anuncios/1245
```

---


## Actualizar recurso

- **URL** del recurso ya existente
- Método HTTP **PUT**
- **Nuevos datos**: según la ortodoxia REST, actualizar significaría enviar TODOS los datos del recurso, incluso los que no cambian.
- **PATCH**: cambiar solo ciertos datos. No está tan difundido como PUT al ser una adición más reciente a HTTP.

- **Resultados posibles**:  **204** (Recurso modificado correctamente, no hay nada que añadir :) ), **404** (recurso no existente), Errores ya vistos con POST (**400**, **500**, **403** ...)


---

## Eliminar recurso

*   URL del recurso a eliminar
*   Método **DELETE**
*   **Resultados posibles**:
    *   204 (Recurso eliminado correctamente, nada que añadir)
    *   Errores ya vistos (400, 403, 404, 500, ...)
*   Tras ejecutar el DELETE con éxito, las siguientes peticiones GET a la URL del recurso deberían devolver 404

---

<!-- .slide: class="titulo" -->
# 2. Buenas prácticas en el diseño de APIs REST


---

## Buenas prácticas


- **No sorprender** a los usuarios del API (son los **desarrolladores** que van a implementar *apps* o webs que lo usen, no los usuarios finales de las *apps* o de las webs)
- Centrarse en los **casos de uso**

Así especificadas son aplicables al diseño de cualquier tipo de API, no solo REST

---

## No sorprender al usuario

Seguir las **convenciones estándar** (en nuestro caso, REST)

Pregunta: ¿Qué convenciones REST **no** se están respetando en esta llamada al API "REST" de Twitter que borra un tweet dado su *id*?

![](img_1c/twitter_API.png)
<div class="caption">De la [documentación del API de Twitter](https://dev.twitter.com/rest/reference)</div>


---

El objetivo no es ser puristas REST ([Restafarians](https://en.wiktionary.org/wiki/RESTafarian)) solo por esnobismo, es para facilitar la vida a los usuarios del API

![](img_1c/restafarian.jpg)

---

## Centrarse en los casos de uso

El API debe **facilitar** los casos de uso típicos, no ser un reflejo del funcionamiento interno del sistema, ni  de la base de datos


---

<!-- .slide: class="titulo" -->

# 3. Recursos relacionados entre sí


---

<!-- .slide: class="titulo" -->

# 4. *Consultas* sobre los recursos


---

<!-- .slide: class="titulo" -->

# 5. Algunas cuestiones adicionales

---

<!-- .slide: class="titulo" -->

# ¿Alguna duda?


---




