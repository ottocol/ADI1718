
# Tema 5
# Gestión del estado en el cliente web

---

## 5.1
## Estado local vs estado centralizado

---

## 5.2
## Introducción a Flux

---

Mutaciones de estado + código asíncrono 
== mentos + cola


---

## 5.3
## Redux

---

Redux = Flux + Ideas de Programación Funcional
    
---

Redux es un *patrón* pero también un pequeño ***framework***. Es tan pequeño (100 LOC 😲) que podemos implementar muchas de sus funcionalidades nosotros mismos, sin `npm install redux`

---

## Los 3 principios de redux

- El estado está en una **única estructura de datos**
- El estado **es solo de lectura**
- Los cambios de estado se hacen con **funciones puras**, que devuelven un **nuevo estado**

---

El estado se puede leer pero no modificar directamente. La única forma es a través de una **acción**


---

## Reducer

Una función que dado un **estado** y una **acción** devuelve el nuevo estado

```javascript
f(e, a) => e'
```

La función debe ser **pura**, es decir, sin efectos laterales
 - no referencia variables globales
 - no modifica los parámetros de entrada

---
