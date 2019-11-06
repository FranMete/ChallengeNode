var express = require('express');
 var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
var app = express();
var rootRef = firebase.database().ref('SitiosInteres');
var mdAutenticacion = require('../middleware');

//////
//OBTIENE TODOS LOS OBJETOS DE LA COLECCION CON UNA PAGINACION DE 5 REGISTROS POR 'PAGINA'
//COMENZANDO DESDE EL PARAMETRO 'desde' 
//EL PARAMETRO 'desde' DEBE TENER EL FORMATO DE LOS ID DE LOS REGISTROS P.E. -LsxBMzqPWTCAsCu4RJs EN EL CASO DE IDS AUTOMATICAMENTE GENERADOS CON PUSH
//EL PARAMETRO 'desde' SE PASA POR URL
/////
app.get('/', mdAutenticacion.verificaToken, (req,res) => {
        
       var desde =  req.query.desde || '' ;
      console.log(desde)
       rootRef.orderByKey().startAt(desde).limitToFirst(5).on('value', (snapshot) => {

             return res.status(200).json({SitiosInteres:snapshot});
      
      });
        
});

//////
//BUSCA POR NOMBRE
/////
app.get('/buscador/:nombre', mdAutenticacion.verificaToken, (req,res) => {
        var nombre = req.params.nombre;
        var respuesta = [];
        
        rootRef.once("value")
         .then(function(snapshot) {  
              
              snapshot.forEach((registro) => {
                     
                     var a = snapshot.child(registro.key+`/sitio`).val();
                     
                     if(a == nombre){

                            respuesta.push(registro);
                     }                                   
              }); 
              
              res.send(respuesta) 
        
          })

         .catch(err => {return res.status(404).json({err}) 
 
 }); 
});

/////
//BUSCA POR ID
/////
app.get('/:id', mdAutenticacion.verificaToken, (req,res) => {
       var id = req.params.id;
       rootRef.once("value")
        .then(function(snapshot) {  

              var hasName = snapshot.hasChild(id);

              if(hasName){
                     snapshot.forEach((registro) => {
                         
                        if(registro.key == id){
                            
                            res.send(registro.val());
                         
                        }              
                     });   

              }else{
                 return res.status(404).json({message: 'Registro no encontrado'})   
              } 
       
         })

        .catch(err => {return res.status(404).json({err}) 

}); 
});

//////
//GRABA REGISTROS (GENERA EL ID AUTOMATICAMENTE CON PUSH() DE FIREBASE)
/////
app.post('/', mdAutenticacion.verificaToken,  (req,res) => {
        var body = req.body;
        var rootRefPOST = rootRef.push();
        
        rootRefPOST.set({sitio: body.nombre})
        
         .then(() => {
         
              res.status(201).json({actualizacionOk: true});
         
         })
       
         .catch(err => {return res.status(404).json({err})}) 
 
});

/////
//ACTUALIZA REGISTRO POR ID
/////
app.put('/actualizar/:id', mdAutenticacion.verificaToken, (req,res) => {
       var id = req.params.id;   
      
       rootRef.once('value')
        .then((snapshot) =>{ 
              
              var hasName = snapshot.hasChild(id);
              
              if(hasName){ 
              
                   firebase.database().ref( `SitiosInteres/${id}`).update({sitio: req.body.nombre});
                   return res.status(200).json({mensaje:'Actualizado con éxito'});    
              
              }else{
              
                   res.send('No existe un resgistro con el id ' + id)  
              }
        })
        .catch((err) => res.send(err))

});

/////
///BORRA REGISTRO POR ID
/////
app.delete('/borrar/:id', mdAutenticacion.verificaToken, (req,res) => {
      
        var id = req.params.id;
        console.log(id)
      
        rootRef.once('value')
          .then((snapshot) => {

              var hasName = snapshot.hasChild(id);             
                   console.log(hasName)
              if(hasName){

                     firebase.database().ref(`SitiosInteres/${id}`).remove()
                     .then( () => {res.send('Borrado con éxito el registro con el id ' + id)})
                     .catch((err) => {res.send(err)})
              
              }else{
              res.send('No existe un resgistro con el id ' + id)
              }
           
              })
              .catch((err) => res.send(err))
       
});

module.exports = app;