
<!-- .slide: class="titulo" -->
# Tema 1, parte 5
# Autenticación en APIs REST

---

## Contenidos

1. Autenticación con sesiones
2. HTTP Basic
3. Tokens
4. OAuth

---

<!-- .slide: class="titulo" -->
# 1. Autenticación con sesiones

---

## Sesiones

*   Aunque HTTP es originalmente un protocolo sin estado, en la mayoría de aplicaciones web del mundo real existe el concepto de "sesión"
*  **Sesión**: conjunto de datos que "se recuerdan" mientras vamos navegando entre páginas (usuario autentificado, carro de la compra, ...)

---

## Cookies

- Extensión al protocolo HTTP que permite al cliente almacenar datos "persistentes" entre ciclos petición/respuesta
- Son pares clave=valor
- Típicamente se crean a petición del servidor
- Las **almacena el cliente** pero se las envía al servidor en cada petición


---

## Mantenimiento de sesiones con cookies

- Casi todos los _frameworks_ de programación del servidor pueden generar automáticamente **cookies con valores pseudoaleatorios** lo bastante largas para ser usadas como "id de sesión" con cierta seguridad (==difícil generar maliciosamente una que coincida con una sesión activa)
- Esto permite **almacenar datos en el servidor** exclusivos de cada usuario. El "id de sesión" sirve como "clave" para recuperar los datos

---


![](img_1e/cookie_sesion.png)

---

## API de sesiones

- En casi todos los _frameworks web_ las cookies de sesión son transparentes al desarrollador
- El API permite almacenar/recuperar objetos en la "sesión", una especie de BD privada de cada usuario, guardada en el servidor

![](img_1e/sesiones_bd.jpg)

---

## Sesiones en Express

```javascript
var express = require('express');
var session = require('express-session');

var app = express();
app.use(session({secret:'123456'}));

//Ejemplo tonto de uso de sesiones. No es un API REST
//hacemos p.ej. add?palabra=hola y lo va añadiendo a una lista de palabras
app.get('/add', function(pet, resp) {
    var palabra = pet.query.palabra
    if (palabra) {
        if (!pet.session.palabras)     
            pet.session.palabras= [];
        pet.session.palabras.push(palabra)
        resp.send("Ahora las palabras son: " + pet.session.palabras)
    }
    else
        resp.status(400).send('Falta el parámetro "palabra"')
})
```

---

## Autenticación con sesiones

Tras hacer login correctamente, guardamos en la sesión un dato indicando que el cliente se ha autentificado OK. Si no está en la sesión, no se ha autentificado

```javascript
var express = require('express');
var session = require('express-session');

var app = express();
app.use(session({secret:'123456'}));


app.get('/doLogin', function(pet, resp) {
    if (pet.query.login=='pepe' && pet.query.password=='123456') {
         pet.session.usuarioActual = {login: pet.query.login};
         resp.send("Login OK");
    }
    else {
         resp.status(403);
         resp.send("login y/o password incorrecto");
    }
 });
 
 app.get('/doLogout', function(pet, resp) {
     pet.session.destroy();
     resp.send("logout");
 });
 
 app.get('/restringido', function(pet, resp) {
     if (pet.session.usuarioActual)
         resp.send("OK, tienes permiso");
     else {
         resp.status(401);
         resp.send("Debes autentificarte");
     }
 });

 app.listen(3000, function() {
     console.log("Servidor express iniciado")
 })
```

---

Con Express se puede *modularizar* el chequeo de autenticación mediante *middleware*: funciones que se pueden ejecutar antes del manejador de la petición HTTP.

![](img_1e/pipeline.png)

---

## *Middleware* para autenticación en Express

```javascript
//función que actúa de middleware
function checkAuth(pet, resp, next) {
    if (pet.session.usuarioActual)
        //next es el siguiente middleware de la cadena, 
        //o el manejador de la petición
        next();
    else {
        resp.status(401);
        resp.send("Debes autentificarte");      
    }
}

app.get('/restringido2', checkAuth, function(pet, resp) {
    resp.send("Si estás viendo esto es que eres importante!!!");
});
```


---

## A favor de las sesiones

*   Las sesiones basadas en _cookies_ vienen ya implementadas en la mayoría de plataformas de desarrollo web en el servidor
*   Si alguien intercepta la comunicación, es sencillo invalidar la sesión 

---

## En contra de las sesiones

- **Escalabilidad**: es mucho más fácil escalar una app con servidores *stateless*. Al cliente no le importa qué instancia sirva las peticiones, podemos redirigirlas, poner en marcha nuevos servidores, "tirar" los que ya hay, etc.
- "filosofía" REST: el API no debe recordar el estado, el estado actual se transfiere con cada petición

---

<!-- .slide: class="titulo" -->
# 2. Autenticación con HTTP Basic

---

## HTTP Basic

- Mecanismo **estándar** de autenticación en HTTP
- Como HTTP **no tiene estado** hay que enviar las credenciales **en cada petición**. 
- Se envía login y password en Base64 (==¡sin cifrar!), separados por ":" dentro de la cabecera `Authorization`

```http
Authorization: Basic cGVwaXRvOjEyMzQ1Ng==
```

---

## HTTP Basic (2)

Cuando se intenta acceder a un recurso protegido sin cabecera `Authorization`, el servidor responde con un _status_ 401 y una cabecera `WWW-Authenticate`

```http
401 UNAUTHORIZED HTTP/1.1
...
WWW-Authenticate: Basic realm="nombre del realm"
```

---

Cuando el navegador recibe un `401` + cabecera `WWW-Authenticate` hace que "salte" el típico cuadro de diálogo de login

![](img_1e/ventana_login.png)

Si no queremos que aparezca, habrá que "saltarse" el estándar (*status* distinto de 401 u obviar la cabecera `WWW-Authenticate`)

---


## A favor de HTTP Basic

- **Estándar** HTTP
- Sencillo de implementar
- Es **stateless**, no obliga a mantener estado en el servidor

---

## En contra de HTTP Basic

- Login y password se transmiten sin cifrar. Por tanto hay que usar **HTTPS**. Una mejora es **HTTP Digest**, que hace un _hash_ MD5 de los datos.
- Si se intercepta la comunicación sin HTTPS, hay que cambiar el *password*

---
<!-- .slide: class="titulo" -->
# 3. Autenticación con *tokens*

---

## Tokens

1.  Cuando se hace login correctamente el servidor nos devuelve un **token** (valor idealmente único e imposible de falsear)
2.  A partir de este momento para cualquier operación restringida debemos enviar el token en la petición

Similar a HTTP Basic pero no se está enviando un dato tan crítico como el *password*

---

## JSON Web Token (JWT)

*   [Estándar IETF](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html). Hay implementación en multitud de lenguajes.
*   Es una cadena formada por 3 partes:
    1.  **Cabecera**: indica el tipo de token y el algoritmo de firma. Se codifica en Base64\. Ejemplo: `{"typ"=>"JWT", "alg"=>"HS256"}` (indica que esto es un "JWT" y se firmará con HMAC SHA-256)
    2.  **Payload**: lo que queremos almacenar en el token en formato JSON (p.ej. `{"login"=>"adi"}`) y codificado en Base64URL
    3.  **Firma**: se aplica un algoritmo de _hash_ sobre la cabecera, el payload y una clave secreta y se pasa a Base64URL
    4.  Las tres partes se concatenan con '.'

```bash
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJob2xhIjoibXVuZG8ifQ.pJPDprjxsouVfaaXau-Fyspj6rpKc7_hCui1RSaERAE    
```


---

## Comprobar un JWT

*   Se vuelve a aplicar el _hash_ sobre la cabecera y el _payload_ (más la clave secreta). Si no coincide con la firma, el token no es válido.
*   En teoría no se puede generar un token falso si no se conoce la clave secreta, y esta no se puede averiguar a partir de un token auténtico
*   Cuidado, **todo se transmite "en claro"**: Base64 es una codificación, no un cifrado. Por tanto normalmente habrá que usar HTTPS si no se quiere que el _payload_ sea legible

---

## Fecha de expiración

*   En el _payload_ se suele incluir una fecha de expiración del _token_. En el estándar se especifica el uso de `exp` (con el nº segundos desde el 1/1/1970)

*   De paso solucionamos el problema de que el mismo _payload_ siempre genera el mismo JWT si no cambiamos el _secret_

---

## Ejemplo en Node.js

```javascript
var jwt = require('jwt-simple');
var moment = require('moment');

var payload = {
    login: 'pepito',
    exp: moment().add(7, 'days').valueOf()
}

var secret='123456';

var token = jwt.encode(payload, secret);
console.log(token);

var decoded = jwt.decode(token, secret);
console.log(decoded);
```

[http://code.runnable.com/V_wah6h2n6cXX0cP/prueba-jwt-for-node-js](http://code.runnable.com/V_wah6h2n6cXX0cP/prueba-jwt-for-node-js)

---

## ¿Dónde viaja el JWT?

*   **Del servidor al cliente**, al ser generado: no hay un estándar. Por ejemplo, en el cuerpo de la respuesta
*   **Del cliente al servidor** para autentificarse:
    *   En HTTP para enviar credenciales se usa la cabecera `Authorization`
    *   Por semejanza con OAuth, que emplea el concepto de "bearer token", se usa el formato

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

---


## A favor de los *tokens*

- Se pueden usar también en aplicaciones nativas (p.ej. móviles)
- El dominio del servicio de autenticación puede ser distinto al del API

---
<!-- .slide: class="titulo" -->

#4. OAuth


---

## ¿Qué es OAuth?

- Protocolo de autenticación usado cuando nuestra aplicación quiere acceder al API de un tercero pero el usuario no está dispuesto a confiarnos su *password*
- Solución: el usuario se autentifica directamente con el API del tercero y este nos cede un *token*, válido durante un tiempo. Si hay problemas es mucho más sencillo anular el *token* que cambiar el password

![](img_1e/oauth-twitter-3-legs.png)
<!-- .element class="stretch" -->

---

## Más sobre OAuth

- La versión actual es la 2, una simplificación de la original
- El protocolo solo especifica el comportamiento general, las implementaciones se ocupan de los detalles
- En el protocolo se especifican varios *grant flows* o [flujos de autorización](https://aaronparecki.com/articles/2012/07/29/1/oauth2-simplified#browser-based-apps)

---

## Ejemplo con Facebook

Como condición previa debemos tener una app dada de alta en FB como desarrolladores. Dicha app tiene un id único.

Ejemplo del denominado *implicit flow* según OAuth 2

[Documentación de FB](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow)

1. Se hace una petición a `https://www.facebook.com/dialog/oauth?client_id={id_de_la_app}&redirect_uri={redirect_uri}&response_type=token`
2. Podemos añadir a la URL anterior el param. `scope` con permisos solicitados por la *app*, por ejemplo `scope=email,publish_actions`
2. FB muestra una página de login para nuestra app
3. Se hace una redirección a la `redirect_uri`. Dentro de la URL de la redirección aparecerá un `access_token` con un *token* para acceder al API. 
4. Para cualquier petición al API se debe usar un parámetro HTTP `access_token` con el *token* obtenido. Por ejemplo

```http
GET https://graph.facebook.com/me?access_token={lo_que_sea}
POST graph.facebook.com/{user-id}/feed?message={message}&access_token={access-token}
```

---

<!-- .slide: class="titulo" -->
# ¿Preguntas...?
