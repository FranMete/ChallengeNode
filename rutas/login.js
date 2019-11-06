
var express = require('express');
var firebase = require('firebase/app');
var app = express();
var jwt = require('jsonwebtoken');
var SEED = require('../config').SEED;

app.post('/',  (req,res) => {
        
        var body = req.body;     
        
        firebase.auth().signInWithEmailAndPassword(`${body.user}`, `${body.pass}`)
        
        .then(function(result) {
        
                var token = jwt.sign({usuario: result.user.email}, SEED , {expiresIn: 14400});
              
               return  res.status(200).json({user: result.user, token});
        })
        
        .catch(function(error) {res.send(error);});
       
});


module.exports = app;