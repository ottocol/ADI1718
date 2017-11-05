var express = require('express')
var bp = require('body-parser')

var app = express()
app.use(bp.json())

var idActual = 2
var lista


app.get('/api/items', function(pet, resp){
   resp.status(200)
   var array = []
   lista.forEach(function(valor) {
      array.push(valor)
   })  
   resp.send(array)
})

app.get('/api/items/:id', function(pet, resp){
   var id = parseInt(pet.params.id)
   if (isNaN(id)) {
    resp.status(400)
    resp.send("El id debe ser numérico")
   }
   else {
    var resultado = lista.get(id)
    if (resultado) {
        resp.status(200)
        resp.send(resultado) 
    }
    else {
        resp.status(404)
        resp.send({userMessage:"El item no se ha encontrado",devMessage:""})   
    }
   }
})

app.post('/api/items', function(pet, resp){
  var obj = pet.body
  if (obj.nombre && obj.cantidad) {
      idActual++
      var nuevoObj = {id: idActual, nombre:obj.nombre, cantidad:obj.cantidad}
      lista.set(idActual, nuevoObj)
      resp.status(201)
      resp.header('Location', 'http://localhost:3000/api/items/' + nuevoObj.id)
      resp.send(nuevoObj)
  }
  else {
      resp.status(400)
      resp.send({error: "faltan parámetros"})
  }

})


app.delete('/api/items/:id', function(pet, resp){
   //intentamos convertir el id a número 
   var idBorrar = parseInt(pet.params.id)
   //si es un número, lo intentamos borrar
   if (!isNaN(idBorrar)) {
      //si el delete del map devuelve true es que estaba 
      if (lista.delete(idBorrar)) {
          resp.status(204)
          resp.end()
      }
      else {
          resp.status(404)
          resp.send("El item con id " + idBorrar + " no existe")
      }
   } else {
      resp.status(400)
      resp.send({error: "El parámetro id debería ser numérico"}) 
   }
})


app.listen(3000, function(){
   lista = new Map() 
   lista.set(1, {id:1, nombre:"Ron", cantidad:"1 botella"})
   lista.set(2, {id:2, nombre:"Tomates", cantidad:"1 kg"})
   console.log("Servidor arrancado") 
})