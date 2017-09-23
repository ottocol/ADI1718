<!-- .slide: class="titulo" -->

# Tema 1
## Introducción a los servicios web REST
# Parte 4
## Más allá de REST

![](img_1d/everywhere.jpg)

---

## Contenidos

1. RPC
2. GraphQL
2. APIs en tiempo real

---

<!-- .slide: class="titulo" -->

# 1. RPC 

---

## Recordar: apps web "clásicas"

- Las URL representan **operaciones** 
- Los datos de entrada se envían como **parámetros HTTP**
- Las peticiones solo pueden ser **GET** o **POST**

```http
//obviamos la autenticación para simplificar
http://uaclouddementira.ua.es/obtenerAlumno?dni=11222333F
```

Esta URL devolvería una **página HTML** con los datos del alumno 

---

Las apps webs clásicas no son **APIs**, ya que devuelven *páginas completas HTML* (==interfaz), no *datos*... pero podemos "APIficarlo" **devolviendo JSON/XML/otros**. Opcionalmente podemos enviar JSON/XML/etc en vez de usar parámetros HTTP 

Petición

```http
http://uaclouddementira.ua.es/obtenerAlumno?dni=11222333F
```

Respuesta

```javascript
{
   "dni":"11222333F"
   "nombre": "Ernesto"
   "apellidos": "Rito Bravo"
   ...  
}
```

---

## APIs RPC

Los APIs de este estilo se denominan **RPC** (Remote Procedure Call) ya que la petición HTTP es muy similar conceptualmente a la llamada a un método o función convencional

```java
Alumno obtenerAlumno(String dni) {
    ...
}

obtenerAlumno("11222333F")
```

RPC sobre HTTP

```http
http://uaclouddementira.ua.es/api/obtenerAlumno?dni=11222333F
```

---

## Recordad el API de Flickr

No es que sea un mal API, simplemente no es REST ¡¡en realidad es **RPC**!! ya que la interfaz es una lista de **operaciones** y no de **recursos**.   

![](img_1d/ops_flickr.png)

*(¿pero por qué se empeñan en llamarlo REST?)*

---

## Recordad el API de Flickr

La única diferencia de sintaxis es que la operación en lugar de estar en la URL es un parámetro HTTP (**`method`**)

```http
https://api.flickr.com/services/rest/?method=flickr.test.echo&name=value
```


---

RPC no es implícitamente inferior (ni superior) a REST

- RPC puede resultar más intuitivo cuando un API se exprese mejor como un conjunto de operaciones/procesos más que de recursos
- REST es el más popular en APIs públicos

---

## Elecciones de diseño en un API RPC

- ¿Qué **protocolo** de transporte se usa?: HTTP, protocolos propios
- ¿Cómo se especifica la **operación**?: URL, parámetro HTTP, dato (JSON/XML/...) en el cuerpo de la petición
- ¿Cómo se pasan los **datos de entrada**?: parámetros HTTP, datos (JSON/XML,...) en el cuerpo de la petición

---

Algunos *frameworks* para desarrollar APIs RPC van un paso más allá y **hacen transparente la llamada remota**. En el código no hacemos peticiones HTTP sino en apariencia solo llamadas a **métodos/funciones**. Por ejemplo, [Apache Thrift](http://thrift.apache.org)

```javascript
//cliente
var transport = new Thrift.TXHRTransport("http://localhost:8585/hello");
var protocol  = new Thrift.TJSONProtocol(transport);
var client = new HelloSvcClient(protocol);
var msg = client.hello_func();
```

<span class="caption">[Ejemplo de cliente Thrift desde el navegador](https://github.com/apache/thrift/blob/master/lib/nodejs/examples/hello.html)</span>

---

## Estándares y protocolos abiertos en APIs RPC

- Estándares
    * [**JSON-RPC**](http://www.jsonrpc.org): JSON sobre HTTP
    * [**SOAP**](https://www.w3.org/TR/soap/)(*): XML sobre (generalmente) HTTP
- Abiertos
    * [**gRPC**](https://grpc.io)(*) (Google): datos binarios sobre HTTP/2
    * [**Apache Thrift**](https://thrift.apache.org)(*): JSON,XML,texto,binario sobre HTTP

(*) Hace transparentes las llamadas remotas

---

## JSON-RPC

- Campos JSON estándar: `jsonrpc` (versión JSONRPC), `method` (operación), `id` (id del cliente), `params` (objeto con parámetros)

- Ejemplo: el *media center* [Kodi](https://kodi.tv) lo usa para permitir el control remoto

```http
# URL
http://<your-ip>:<your-port>/jsonrpc
```

```http
# Cuerpo de la petición
# Pausar (o play si está pausado) el reproductor número 0
{"jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": 0 }, "id": 1}
```

<span class="caption">[http://kodi.wiki/view/JSON-RPC_API/Examples](http://kodi.wiki/view/JSON-RPC_API/Examples)</span>


---

<!-- .slide: class="titulo" -->

# 2. GraphQL

---

<!-- .slide: class="titulo" -->

# 3. APIs en tiempo real

---
