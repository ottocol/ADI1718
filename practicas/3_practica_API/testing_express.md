# *Testing* de aplicaciones Express con Mocha y Supertest

> Los ejemplos están en un repositorio de Github. puedes clonar el repositorio con 
> ```bash
> git clone https://github.com/ottocol/testing-express.git
> ```

## Uso básico de Mocha para *testing* Javascript

Para instalar Mocha, en el directorio de nuestro proyecto (y suponiendo que ya tenemos creado un `package.json`) hacemos

```bash
npm install --save-dev mocha
```

Con `--save-dev` añadimos la dependencia al proyecto pero en modo desarrollo. Es decir, en producción no se necesita `mocha` para ejecutar el proyecto

> Si en un proyecto Node bajado de la web hacemos `npm install` para instalar las dependencias, se instalarán todas (también las de desarrollo), pero si hacemos `npm install --production` las de desarrollo no se instalarán.

### *Testing* de código síncrono

Por ejemplo, supongamos que tenemos el siguiente módulo, sobre el que vamos a hacer unas cuantas pruebas:

```javascript
//archivo "saludador.js"
var obj = {
    saludar: function() {
        return "hola mundo"
    }
}
module.exports = obj
```

El fichero con la *suite* de pruebas tendría un formato como el siguiente:

```javascript
//archivo "test_saludador.js"
var s = require('saludador')
var assert = require('assert')

describe('mi suite', function(){
    it ('saludar() debería ser una función', function(){
        //comprueba que "saludar" es true, o sea que existe
        assert(s.saludar)  
        //comprueba que es una función
        assert.equal("function", typeof(s.saludar))
    });

    it('saludar() debería devolver hola mundo', function(){
        assert.equal("hola mundo",s.saludar())
    });
})
```

Lo habitual es tener todos los casos de prueba en una carpeta llamada `test`.

Para ejecutar las pruebas se usa la herramienta en línea de comandos `mocha`. Esta se habrá instalado en el directorio `node_modules/.bin` de nuestro proyecto, así que para lanzar los *test* ejecutamos

```bash
./node_modules/.bin/mocha
```

Por defecto mocha irá a la carpeta `test` y ejecutará todas las pruebas allí contenidas. Si el archivo con las pruebas estuviera en otra carpeta tendríamos que pasárselo como argumento, por ejemplo:

```bash
./node_modules/.bin/mocha mi_test.js
```

A alguna gente le gusta más tener las herramientas en línea de comandos instaladas "fuera" del proyecto (instalación global). Cuando hacemos el `npm install` de mocha podemos añadir el *switch* `-g` para hacer este tipo de instalación. En este modo el binario `mocha` se puede ejecutar directamente desde cualquier directorio, ya que debería estar en el PATH.

###  *Testing* de código asíncrono

Como ya hemos visto en muchos ejemplos, gran parte del código Javascript del "mundo real" es asíncrono. Por ejemplo el siguiente código hace una petición HTTP para obtener la página principal de la UA y muestra el HTML. Para simplificar el código usamos un paquete denominado [`superagent`](https://github.com/visionmedia/superagent) (`npm install superagent`), que sirve para hacer peticiones HTTP de modo sencillo:

```javascript
var request = require('superagent')

request
   .get('https://www.ua.es')
   .end(function(error, respuesta){
       console.log(respuesta.text)
    })
```

Supongamos que queremos comprobar que la página de la UA contiene la cadena "Universidad de Alicante". En una primera instancia, podríamos hacer algo como:

```javascript
describe('mi suite asíncrona', function(){
  it ('la petición a www.ua.es contiene el nombre de la UA', function(){
        request
          .get('http://www.ua.es')
          .end(function(error, respuesta) {
            //indexOf devuelve la posición de una subcadena dentro de otra.
            //Si la subcadena no está devuelve -1
            assert(respuesta.text.indexOf("Universidad de Alicante")!=-1)
        })
  })
})
```

Aunque el *test* anterior va a pasar, en realidad es porque no se está comprobando nada. Mocha ejecuta la *suite*, y antes de que llegue la respuesta de la UA (y se ejecute el *callback* con el `assert`) la *suite* ya ha terminado de ejecutarse. **El *assert* no llega nunca a ser comprobado**.

> Puedes verificar que lo anterior es cierto cambiando la cadena buscada por cualquier otra que no esté en la página. Verás que el *test* sigue pasando sin problemas

La solución es ejecutar una función que le indique a Mocha que ya han acabado nuestros *tests*. Hasta que no se ejecute esta función Mocha considerará que el *test* no ha acabado y por tanto "esperará". Dicha función nos la pasa Mocha en el *callback* asociado a cada *test*, y en la documentación y ejemplos se suele llamar `done`:

```javascript
describe('mi suite asíncrona', function(){
    it ('la petición a www.ua.es contiene el nombre de la UA', function(done){
        request
          .get('http://www.ua.es')
          .end(function(error, respuesta) {
            assert(respuesta.text.indexOf("Universidad de Alicante")!=-1)
            //ya ha acabado el test
            done();
        });
    });
})
```

Mocha da un tiempo máximo de 2 segundos a cada test, pasado este tiempo sin terminar lo considera fallido. Si el servidor tarda en responder podría sobrepasar este tiempo máximo. Podemos modificarlo pasando el parámetro `--timeout` en línea de comandos, por ejemplo `.node_modules/.bin/mocha --timeout=5000`. También se puede fijar el *timeout* en el código `.js`, consultar la documentación de Mocha para ver cómo.  

## Uso de `supertest`

Para hacer pruebas de APIs REST nos viebe bien poder realizar peticiones de modo sencillo. Para esto podemos ayudarnos del paquete [`supertest`](https://github.com/visionmedia/supertest). Lo instalaremos, como viene siendo habitual con:

```javascript
npm install --save-dev supertest
```

Por ejemplo supongamos que tenemos el siguiente código Express que queremos probar:

```javascript
var express = require('express');
var app = express();

//En Express asociamos un método HTTP y una URL con un callback a ejecutar
app.get('/', function(pet,resp) {
   //Tenemos una serie de primitivas para devolver la respuesta HTTP
   resp.status(200);
   resp.set('X-Mi-Cabecera', 'Hola')
   resp.send('Hola soy Express'); 
});

//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
   console.log("El servidor express está en el puerto 3000");
});

module.exports = app;
```

La mejor forma de ver el uso de `supertest` es a través de un ejemplo:

```javascript
var hola_express = require('hola_express');
var supertest = require('supertest');


describe('prueba de la app web', function(){
    it('/ devuelve el contenido adecuado', function(done){
        //Al objeto supertest le pasamos la app de Express
        supertest(hola_express)
            //Hacemos una petición HTTP
            .get('/')
            //Supertest incluye sus propias aserciones con 'expect'
            //Cuando ponemos un entero estamos verificando el status HTTP
            .expect(200)
            //Cuando ponemos dos String estamos verificando una cabecera HTTP
            .expect('X-Mi-Cabecera', 'Hola')
            //Si ponemos un string  estamos verificando el cuerpo de la respuesta
            //Como esta ya es la última expectativa, pasamos el 'done'. Supertest lo llamará
            //Cualquier 'expect' admite el 'done' como último parámetro
            .expect('Hola soy Express', done);
    });
    it('La ruta /hola no existe', function(done){
        supertest(hola_express)
            .get('/hola')
            .expect(404, done);
    });
});
```

`Supertest` usa internamente la librería [`superagent`](http://visionmedia.github.io/superagent), así que podemos consultar en la documentación de esta última cómo realizar otro tipo de peticiones [como `POST` o `PUT`](http://visionmedia.github.io/superagent/#post-/%20put%20requests)

Como hemos visto, hay un `expect` para comprobar el *status* HTTP, otro para comprobar cabeceras, etc. Para comprobar una condición arbitraria podemos pasarle a `expect` una función en la que pondremos los `assert` que queramos. Dicha función recibirá automáticamente como parámetro un objeto [`response`](http://visionmedia.github.io/superagent/#response-properties) de [`superagent`](http://visionmedia.github.io/superagent).

```javascript
supertest(hola_express)
    .get('/')
    .expect(function(respuesta){
        //El parámetro es un objeto de tipo "response" de superagent 
        //La propiedad 'text' es el texto "raw" del cuerpo de la respuesta
        assert(respuesta.text.indexOf('Express')!=-1);
    })
    //El callback de antes no recibe el 'done', así que tenemos que usar 'end',
    //que acaba el test llamando a la función que le pasemos
    .end(done);
```
