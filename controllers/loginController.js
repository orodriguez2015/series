var model      = require('../models/models.js');
var salidaJson = require('./salidaUtil.js');


/**
  * Función que se invoca autenticar a un usuario. Recibe la contraseña
  * y el login, y comprueba si se trata de un usuario que está en la base de datos.
  * Si el usuario existe, se almacena un objeto en la sesión, en el parámetro user
  * @req: Objeto request
  * @res: Objeto response
  * @next: Objeto next
  */
exports.autenticate = function(req,res,next){
    var login    = req.body.login;
    var password = req.body.password;

    console.log(" Autenticando al usuario de login: " + login);

    // Se obtiene el hash SHA1 de la password, de modo que se almacenará en base de datos
    var encriptar = require('../utilidades/encriptacion.js');
    var passMd5 = encriptar.encriptarPassword(password);

    model.User.find({where: {login:login,password:passMd5}}).then(function(user){

        var usuario = {
            status: '',
            id:'',
            login:'',
            nombre: ''
        };

        if(user!=undefined){
            console.log("Usuario autenticado id: " + user.id + ",login " + user.login);
            // Se almacena un objeto con el id y login del usuario en la sesión

            var nombreCompleto = user.nombre + " " + user.apellido1;

            usuario.status = 0;
            usuario.id = user.id;
            usuario.login = user.login;
            usuario.nombre = nombreCompleto;

            // Se almacenan los datos del usuario en la sesión
            req.session.user = usuario;
            salidaJson.devolverJSON(res,usuario);

        } else {
            usuario.status = 1;
            salidaJson.devolverJSON(res,usuario);
        }

    }).catch(function(err) {
        console.log("Error al verificar la entidad del usuario de id " + userId + ": " + err.message);
        res.status(500).send("Error al verificar la entidad del usuario de id " + userId + ": " + err.message);
    });
};


/**
  * Función que se invoca para cerrar la sesión de un usuario
  * @req: Objeto request
  * @res: Objeto response
  * @next: Objeto next
  */
exports.destroy = function(req,res,next){
    var usuario = req.session.user;
    if(usuario!=undefined) {
        console.log("Cerrando la sesión del usuario");
        // Se elimina el atributo user de la request
        delete req.session.user;
    }
    // Se redirige a la url desde la que se ha hecho la petición de logout
    res.redirect(req.session.path.toString());
};


exports.loginRequired = function(req,res,next) {
    if(req.session.user!=undefined) {
        // Si existe el objeto user en la sesión, el usuario ya se ha autenticado.
        // Se redirige la petición al siguiente middleware
        next();
    } else {
        // Si el usuario no está autenticado, se devuelve un error HTTP 500
        // Antes de redirigía a la pantalla de login, pero para un API RESTFUL
        // no tiene sentido
        //res.redirect("/login");
        res.status(500).send("Usuario no autenticado");
    }

};
