# SEMANA 1

## Principios generales en el diseño de APIs

- No sorprender al usuario (Irresistible APIs): 
  - seguir las convenciones del estilo elegido: ejemplo de Flickr y de por qué no
  - POST para borrar tweets https://dev.twitter.com/rest/reference/post/statuses/destroy/id
- Centrarse en los casos de uso (Irresistible APIs)
   * No exponer los detalles internos de implementación: ejemplo cesta compra de 5 Anti-Patterns in Designing APIs 

## Cuestiones técnicas

- recursos relacionados entre sí
    - building APIs You Won't Hate, cap. 7
- querying
  - búsqueda con parámetros
  - consultas parciales: Queries ad hoc como linkedin
  - consultas de varios items dando una lista
  - paginado
- versionado
- formato de datos


---

# SEMANA 2:

## No sé dónde meterlo

- herramientas para modelado y diseño de APIs
- escalabilidad
    + cache
        * conditional GETs
        * conditional PUTs
    + rate limiting y API keys
- hipermedia
- APIs no REST
- Webhooks


# Recursos

## Charlas sobre APIs

- https://www.infoq.com/presentations/rest-streaming-api
- https://www.infoq.com/presentations/5-api-design-anti-patterns
- https://www.infoq.com/presentations/etsy-api
- https://www.infoq.com/presentations/api-design-first


...