
<!-- .slide: class="titulo" -->

# Tema 1
## Introducción a los servicios web REST
# Parte 2
# APIs REST de tipo CRUD

---

## Recapitulando: el API de una aplicación web "clásica"

* Las **llamadas** al API suelen ser **verbos**, que indican **acciones**: `ponerNota`, `listarAlumnos`
* Los **datos** se envían en formato "*nombre=valor&nombre2=valor2...*": `orden=asc&convoc=ene2016`

---

Además y centrándonos en el cliente, las apps clásicas suelen usar plantillas generadas desde el servidor. El cliente se limita a **renderizar HTML/CSS** ya generado.

En los primeros temas de ADI **vamos a olvidar por el momento el cliente y centrarnos en el servidor** y en cómo comunicarnos con él

---

## Aplicaciones REST

* **REST** es en principio un "estilo"/arquitectura para el diseño de *sistemas hipermedia*. Es una serie de reglas de diseño de cómo interactuar con la aplicación, es decir, **reglas de diseño del API**.

---

<!-- .slide: class="dim" -->
<!-- .slide: data-background-image="https://motoycasco.com/wp-content/uploads/2014/09/consejos-vender-moto-cuidado-detalles-fotos-2.jpg" -->
<!-- .slide: style="color: white; text-shadow: 1px 1px 10px black" -->


## ¿Por qué REST?

Sean por las razones que sean, en la actualidad **la inmensa mayoría de los APIs web** siguen los principios de REST

---

## REST básico
  
* REST puede verse como un intento de **volver a los principios de HTTP**. En teoría REST es independiente de HTTP (*pero entre nosotros, y sin que nos oiga [Roy Fielding](https://twitter.com/fielding?lang=es), son casi lo mismo*)
* **Cambio de filosofía** sobre las apps web clásicas: en lugar de diseñar métodos concretos (`ponerNota`, `listarAlumnos`) aplicaremos una serie de **operaciones** ya predefinidas (GET, POST, PUT, DELETE) sobre los **recursos** (entidades) de nuestra aplicación (asignaturas, alumnos, notas)

---

## Recursos en REST

*  Un **recurso** es una entidad o una colección de entidades
*  Cada recurso se debe identificar con una **URL** única

Típicamente, las colecciones se ponen en plural, y un recurso concreto dentro de una colección se representa concatenando un identificador a la colección

Ejemplo de un supuesto campus virtual de la UA

```HTTP
/* todas las carreras */
http://api.cv.ua.es/carreras
/* Grado en Ingeniería Informática */
http://api.cv.ua.es/carreras/GII/
/* todos los alumnos de la UA */
http://api.cv.ua.es/alumnos
/* Un alumno concreto */
http://api.cv.ua.es/alumnos/11222333N
```

---


IMPORTANTE: una URL de un recurso no es nada más que un "puntero" al recurso. Para hacer algo útil en el API habrá que lanzar una petición HTTP sobre esta URL

---


## Operaciones en REST

Los métodos **POST/GET/PUT/DELETE** se asocian respectivamente con las operaciones **Crear/Leer/Actualizar/Borrar** (CRUD), respectivamente

---

## Ejemplos de "llamadas" al API: operación + recurso

* **Obtener** el listado de *todos* los alumnos: petición HTTP
   - de tipo GET
   - a la URL `http://miaplicacion.com/alumnos`
* **Obtener** los datos del alumno con DNI `11222333N`: petición HTTP
   - de tipo GET
   - a la URL `http://miaplicacion.com/alumnos/11222333N`
* Dar de **alta** un alumno: petición HTTP
   - de tipo POST
   - adjuntando los datos del nuevo alumno
   - a la URL `http://miaplicacion.com/alumnos`


---

Solo nos falta un **formato estandarizado** para los datos

* Que el servidor envía al cliente en peticiones de tipo GET
* Que el cliente envía al servidor en peticiones de tipo POST/PUT

---


## Intercambio de datos en REST

*   **JSON**: formato estándar e independiente del lenguaje para representar objetos. Originario de Javascript
*   Es mucho más legible y flexible que el `nombre=valor&nombre2=valor2...`. Se pueden representar objetos compuestos de otros, arrays, ...

```

{
nombre: "Pepe Pérez",
edad: 19, 
direccion: {
calle: "Pez",
num: 15}
}

```

---

## ¿Por qué REST en lugar de otras alternativas?

En realidad REST no es más que **un conjunto de convenciones arbitrarias**, que podrían ser de otro modo

![](img_1b/bushphone.jpg)

---

## ¿Por qué REST en lugar de otras alternativas? (II)

> Para diseñar un buen API para los servicios necesitamos usar algo que la gente conozca. Así que, **aunque no hay nada superior desde el punto de vista técnico en REST** y JSON con respecto a usar RPC con un protocolo de más bajo nivel, **usar algo que la gente comprenda bien [...] ayuda mucho en el diseño del API**


<div class="caption">Jay Krebs, [Lessons from Building and Scaling LinkedIn](http://www.infoq.com/presentations/linkedin-architecture-stack) (QCon, NY 2013)</div>

---

## CRUD no es suficiente

Un API CRUD es un API muy pobre, pero por algún sitio se empieza...la próxima semana veremos APIs REST más "avanzados"

