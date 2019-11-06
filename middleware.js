var jwt = require('jsonwebtoken');
var SEED = require('./config').SEED;

/////
// Verificar token
/////
exports.verificaToken = function(req,res,next) {
 var token = req.query.token;
 console.log(token)
 jwt.verify( token, SEED, ( err, decoded ) => {
        if( err ){
         return  res.status(401).json({
             ok: false,
             mensaje: 'Token incorrecto',
             errors: err
                     });
        }
    
         next();
       
 });

};
