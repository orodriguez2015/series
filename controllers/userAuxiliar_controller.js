var model = require('../models/models.js');

/**
  * Función llamada para comprobar si existe un usuario
  * con un determinado login en la base de datos
  * @param login: Login del usuario
  * @param callback: Funcion callback 
  */ 
exports.existeLogin = function(login,callback) { 

	model.User.find({
      where: ["login=?",login]

    }).then(function(user) {
    	console.log("userAuxiliar_controller existe el usuario con login");
    	// Existe un usuario con el login 
    	callback(null,user);

    }).catch(function(err) { 

    	console.log("Error al comprobar si existe un usuario con el login " + login + ": " + err.message);
    	callback(err,null);
    });
};



/**
  * Función llamada para comprobar si existe un usuario
  * con un determinado email en la base de datos
  * @param email: Email del usuario
  * @param callback: Funcion callback 
  */ 
exports.existeEmail = function(email,callback) { 

	model.User.find({
      where: ["email=?",email]

    }).then(function(user) {
    	// Existe un usuario con el login 
    	console.log("userAuxiliar_controller existe el usuario con email");
    	callback(null,user);
    	
    }).catch(function(err) { 

    	console.log("Error al comprobar si existe un usuario con el email " + email + ": " + err.message);
    	callback(err,null);
    });
};



/**
  * Función que comprueba si existe en la BD un usuario con un login o email y que no sea
  * el usuario cuyo id se pasa en el parámetro idUsuario
  * @param login: Login a comprobar
  * @param email: Email a comprobar
  * @param idUsuario: Id del usuario
  * @param callback: Función callback que se invoca para devolver un resultado, que será el usuario
  * o error que se ha producido al ejecutar la función 
  */
exports.existeOtroUsuarioConLoginEmail = function(login,email,idUsuario,callback) {
    
  // Se importa sequelize
  var Sequelize = require('sequelize');
/*
  var condition = {
    where: 
    Sequelize.or(
      {
       email: { eq: email},
       login: { eq: login }
      }
    )
};
*/    
    
    /* EQUIVALE A UN AND */
    var condition1 = {
        where: {
                id: { ne: idUsuario},
                login: { eq: login }
        }
    }
    
    
    var condition2 = {
        where: {
                id: { ne: idUsuario},
                email: { eq: email }
        }
    }

    model.User.findAll(condition1).then(function(users){
        
        // -1 --> Error técnico
        // 0 --> OK
        // 1 --> Ya existe usuario con el nuevo login
        // 2 --> Ya existe un usuario con el nuevo email
        var salida = { status: -1 };
        
        if(users!=undefined && users!=null && users.length>0){
            console.log("Existe algún otro usuario con el mismo login, no se permite la edición");
            // Si hay un usuario con el login, se retorna error
            salida.status = 1;
            callback(salida,null);
            
        }else {
            // Se comprueba si ya existe otro usuario con el email   
            model.User.findAll(condition2).then(function(users){
                if(users!=undefined && users!=null && users.length>0) { 
                    console.log("Existe algún otro usuario con el mismo email, no se permite la edición");
                    // Existe un usuario con el email, se retorna error
                    salida.status = 2;
                    callback(salida,null);
                } else {
                    salida.status = 0;
                    callback(salida,null);       
                }
            }).catch(function(err){
                callback(null,err);  
            });    
        }
    
    }).catch(function(err){
        var salida = { status: -1 };
        callback(null,err);   
    }); 
    
};