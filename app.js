//Requires
var express = require('express');
var bodyParser = require('body-parser');
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
var FirebaseConfig = require('./firebaseConfig');
var appFirebase = firebase.initializeApp(FirebaseConfig);
var app = express();

//body parcer 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//
var appDefault = require('./rutas/app');
var appLogin = require('./rutas/login');
var appSitios = require('./rutas/sitios');

//Cors y cabeceras
app.use((req, res, next) => {

      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');  
  
      next();
  
});

//Rutas 
app.use('/login', appLogin);
app.use('/sitios', appSitios);
app.use('/', appDefault);

//Escuchar peticiones
var server = app.listen(process.env.PORT || 3001, () => {
      console.log('Express server puerto ' + server.address().port +'\x1b[36m%s\x1b[0m', ' online');
});

module.exports =  firebase