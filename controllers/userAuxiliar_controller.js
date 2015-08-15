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