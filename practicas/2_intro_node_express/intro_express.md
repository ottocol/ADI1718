# Introducción a los APIs REST con Express

Express es un *framework* web para Node que se caracteriza por ser bastante ligero y minimalista. No es tan sofisticado como otros *frameworks*. No obstante con las funcionalidades que ofrece nos va a bastar para implementar APIs REST:

- *Routing*: una forma simple de asociar un método HTTP y una URL con el código a ejecutar. 
- Métodos más flexibles que el `write` de Node para generar los contenidos de la respuesta.

> Hay otros *frameworks* web para Node que hacen mucho más sencillo y automático el proceso de implementar APIs REST. Nosotros usaremos Express precisamente porque nos va a obligar a implementar muchas cosas "a mano", lo cual puede no ser bueno para la productividad, pero sí lo es para realmente entender cómo funciona un API REST. Si el *framework* crea "automágicamente" el API por nosotros, mal vamos a aprender en qué consiste REST. 

Además de esto, Express se integra con un gran número de *motores de plantillas*, para aplicaciones web "clásicas" que devuelven HTML/CSS al cliente en lugar de datos "en crudo" en JSON. Nosotros **no usaremos plantillas** de momento ya que por ahora solo implementaremos APIs, no sitios web. 

### Hola Express

El siguiente código sería el clásico "Hola mundo" en versión `Express`

```javascript

//Cargamos el módulo express
var express = require('express');
var app = express();

//En Express asociamos un método HTTP y una URL con un callback a ejecutar
app.get('*', function(pet,resp) {
   //Tenemos una serie de primitivas para devolver la respuesta HTTP
   resp.status(200);
   resp.send('Hola soy Express'); 
});

//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
   console.log("El servidor express está en el puerto 3000");
});
```

Guardar el código anterior en un archivo `hola_express.js` y crear un `package.json` en el mismo directorio con el siguiente contenido:

```json
{
  "name": "hola_express",
  "version": "1.0.0"
}
```

Ahora podemos instalar `express` en el proyecto y actualizar además automáticamente el `package.json` con 

```bash
npm install express --save
```

Para ejecutar el ejemplo haríamos:

```bash
node hola_express.js
```

## APIs REST básicos con Express

### Routing

El *routing* es el mapeo entre URLs y funciones javascript a ejecutar. Vamos a ver las distintas formas en las que podemos hacer este mapeo.

#### Routing "simple"

La forma más simple de *routing* consiste en usar la llamada del API `app.METODO(path, [callback...], callback)`, donde `app` es una instancia  de `express`, `METODO` es el método HTTP (`get`, `post`,...), `path` es la URL a mapear y `callback` es la función a ejecutar (como puede verse, podrían especificarse varias).

```javascript
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  console.log('hola express');
});
```

En APIs REST es habitual tener partes fijas y variables en una URL. Por ejemplo algo como `/usuarios/pepe89`, `usuarios/darksoul33` En Express podemos denotar estas **partes variables** precediéndolas del carácter `:`. En el manejador de la URL su valor será accesible a través del [objeto `params`](http://expressjs.com/4x/api.html#req.params) de la petición (que también nos permite acceder a los **parámetros HTTP**). Por ejemplo:

```javascript
var express = require('express');
var app = express();

app.get('/usuarios/:login', function(req, res) {
  console.log('Se ha solicitado el usuario ' + req.params.login);
});

```

> Los *paths* a mapear pueden ser literales o bien expresiones regulares. Podéis consultar la documentación de Express  para [más información](http://expressjs.com/guide/routing.html#route-paths) sobre este aspecto.

En aplicaciones REST es habitual realizar varias operaciones sobre el mismo recurso, con la misma URL y variando únicamente el método HTTP. En Express podemos encadenar todos los manejadores para la misma ruta:

```javascript
app.route('/libro')
  .get(function(req, res) {
    console.log('Obtener un libro');
  })
  .post(function(req, res) {
    console.log('Añadir un libro');
  })
  .put(function(req, res) {
    console.log('Actualizar un libro');
  });
```

#### Routing modular

Conforme va creciendo el número de recursos y rutas en una aplicación REST se va haciendo más necesaria la posibilidad de dividir la aplicación en varios módulos. La clase `express.Router` puede usarse para crear manejadores de forma modular. Cada *router* es como una "mini-aplicación" independiente, que se puede "montar" en una determinada trayectoria.

Por ejemplo, podemos definir un *router* como un módulo CommonJS de este modo:

```javascript
//Archivo "usuarios.js"
//"Mini-aplicación" REST para gestionar usuarios
var express = require('express');
var router = express.Router();

router.get('/:login', function(req, res) {
  console.log('Obtener el usuario con login ' + req.params.login);
});
router.post('/', function(req, res) {
  console.log('Crear un usuario');
});
...

module.exports = router;
```

En la aplicación principal es donde montaríamos y usaríamos el *router*

```javascript
var express = require('express');
var app = express();
//Cargamos el módulo CommonJS
var usuariosApp = require('./usuarios');
//Montamos la "mini-aplicación" en la trayectoria "/usuarios"
app.use('/usuarios', usuariosApp);
```

### Middleware

Un *middleware* es una función que asociamos a una o varias rutas y que se ejecutará en un determinado momento del ciclo petición/respuesta. Para una misma ruta podemos ejecutar varios *middleware* (luego veremos cómo se especifica el orden de ejecución).

Podemos escribir nosotros mismos el *middleware*, aunque para funcionalidades típicas existen muchas librerías de terceros, por ejemplo para leer las *cookies* o para parsear el cuerpo de la petición en formato JSON.

En código, un *middleware* es una función que tiene tres parámetros: la petición, la respuesta, y una función que sirve para ejecutar el siguiente *middleware* en la "cadena". Para vincular un *middleware* con la aplicación empleamos el método `use`

```javascript
//Middleware que hace un log del momento en que se ha hecho cada petición
app.use(function (req, res, next) {
  console.log('Petición en :', Date.now());
  //LLamamos a next para que se siga ejecutando el resto de middlewares
  //Si no hiciéramos esto, la respuesta se quedaría pendiente
  next();
});
```
En el ejemplo anterior hemos vinculado el *middleware* a la aplicación Express, pero también podríamos vincularlo a un *router*, o solo a la gestión de errores.

También podemos vincular un *middleware* únicamente a un método HTTP, pasándolo como segundo parámetro de `app.METODO`:

```javascript
app.get('/usuario/:id', function (req, res, next) {
  console.log('GET sobre el usuario ' + req.params.id);
  next();
});
```

Finalmente podemos vincular varios *middleware*, simplemente pasándolos como parámetros uno tras otro:

```javascript
app.use('/usuario/:id', function(req, res, next) {
  console.log('URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Método HTTP:', req.method);
  next();
});
```

> Es importante acordarse de llamar a `next()` si queremos que continúe ejecutándose la "cadena" de *middlewares*. En el ejemplo anterior, si en el primer *middleware* no hubiéramos llamado a `next()` el segundo no se llegaría a ejecutar nunca.

En realidad en Express **los manejadores de ruta también son *middleware***. Hasta el momento, en todos los ejemplos hemos puesto manejadores con solo dos parámetros, porque en cada ruta solo ejecutábamos una operación,  pero podríamos usar también `next` para "modularizar" los manejadores.

### Procesamiento de la petición

En aplicaciones REST vamos a necesitar la siguiente información de la petición:

- Partes variables de la URL
- Parámetros HTTP  
- Cuerpo de la petición (para POST/PUT)

Los dos primeros ya hemos visto que son accesibles a través de la propiedad `params` del objeto petición. Para acceder al **cuerpo de la petición** podemos usar la propiedad `body`. Esta propiedad nos da el contenido "en crudo" como una cadena de caracteres. 

En REST es habitual que el cuerpo de una petición POST/PUT sea un objeto en formato JSON. El *middleware* denominado [body-parser](https://www.npmjs.com/package/body-parser) transforma automáticamente el `body`en un objeto Javascript a partir del JSON.

Este *middleware* no viene incluido automáticamente con Express. Para instalarlo, desde línea de comandos:

```bash
#recordar que con --save actualizamos el package.json
npm install body-parser --save
```

Ahora podemos usarlo del siguiente modo:

```javascript
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//En este caso hemos vinculado el middleware con la aplicación global
//También lo podríamos vincular a un router o a una URL
app.use(bodyParser.json());

app.post('/usuarios', function(req, res) {
  //por obra y gracia del body-parser, obtendremos automáticamente
  //un objeto JS a partir del JSON del cuerpo de la petición 
  var nuevoUsuario = req.body;
  ...
});
```

> El *middleware* `body-parser` puede *parsear* otros formatos además de JSON. Nótese que en el ejemplo hemos vinculado el `bodyParser.json()` porque era la funcionalidad que nos interesaba. Podríamos haber vinculado por ejemplo `bodyParser.urlencoded()` para parsear peticiones de tipo `application/x-www-form-urlencoded`. Se recomienda consultar [la documentación de `body-parser`](https://github.com/expressjs/body-parser#body-parser).


### Generación de la respuesta

Todos los ejemplos de este apartado usan los métodos de la ["clase" `Response`](http://expressjs.com/4x/api.html#res). Recordemos que en un manejador de Express la respuesta es accesible como segundo parámetro del *callback*.

```javascript
//"res" es el objeto de tipo Response
app.get('/usuarios', function(req, res) {
  ...
});
```

En los ejemplos vamos a usar `res` como variable `Response`, aunque evidentemente su nombre puede ser el que deseemos.

Para **enviar una cabecera** usar el método `header(campo, valor)` (el método `set` es equivalente)

```javascript
res.header('Content-Type', 'text/plain');
//Se pueden enviar varias cabeceras "de golpe", como propiedades de un objeto JS
res.header({
  'Content-Length': '123',
  'ETag': '12345'
});
```

Algunas cabeceras muy comunes tienen su propio método, por ejemplo:

```javascript
//Content-Type
res.type('application/json');
//Location
res.location('http://www.ua.es');
...
```

Para **enviar un contenido** en la respuesta se usa habitualmente `send`, que admite `Strings`, objetos Javascript u objetos `Buffer` (este último tipo es [nativo de Node](http://nodejs.org/api/buffer.html) y sirve para trabajar con datos binarios).

```javascript
res.send('Hola navegador');
//Los objetos JS se transforman automáticamente a JSON
var usuario = {login:'Pepe', password:'123456'}
res.send(usuario);
//También se envían en JSON los arrays
res.send([1,2,3]);
```

Para **generar un código de estado HTTP** se usa el método `status`. Este método se puede encadenar con los otros métodos de envío de respuesta

```javascript
//end() finaliza la respuesta. En este caso enviaríamos un cuerpo vacío
res.status(500).end();
//Aquí enviamos un mensaje de error en el cuerpo de la respuesta
res.status(403).send('No tienes permiso para acceder a esta operación');
//Enviamos una imagen GIF supuestamente ilustrativa del 404
res.status(404).sendFile('imagen404.gif');
```

### Gestión de errores

Si en una función *middleware* ejecutamos `next` pasándole como parámetro [un objeto `Error`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Error), dispararemos la gestión de errores de Express (en realidad bastaría con pasar un valor `==true`, pero no sería descriptivo del error ocurrido).

La gestión de errores de Express dirige el flujo de ejecución hacia el/los **manejadores de error**. Un manejador de error no es más que un *middleware* que tiene como primer parámetro adicional un objeto del tipo `Error`.

```javascript
//Manejador de error muy simple, solo útil para ilustrar la sintaxis Express.
//Ante cualquier error no nos complicamos, generamos un status 500
//y en el cuerpo de la respuesta mandamos info sobre el error en JSON
app.use(function(err, req, res, next) {
    res.status(500);
    res.send({
        mensaje: err.message,
        error: err
    });
});
```

Desde nuestro manejador de Express podemos disparar el error de este modo:

```javascript
app.get('/usuario/:id', function (req, res, next) {
  //Supongamos que esto busca un usuario en la BD
  usuario = buscarUsuario(req.params.id);
  if (!usuario)
    next(new Error('usuario no encontrado'));
  ...
});
```


