var express = require('express');
var router = express.Router();

var usersController = require('../controllers/user_controller.js');


// Autoload para la carga de un usuario en la request
router.param('userId',usersController.load);

// GET /users/new. Carga el formulario de alta de un nuevo usuario
router.get('/users/new',usersController.new);

// POST /users/create. Da de alta un usuario en la base de datos, siempre y cuando no exista
router.post('/users/create',usersController.create);

// GET /users. Renderiza el listado con las tablas de usuarios
router.get('/users',usersController.show);

// DELETE /users/:userId/. Elimina un determinado usuario de la base de datos
router.delete("/users/:userId(\\d+)",usersController.delete);

// POST /users/existsUser. Esta petición comprueba si un login y un email ya está asignado a un 
// usuario del sistema
router.post("/users/existsUser",usersController.exists);

// GET /. Página de entrada en el sistema
router.get('/',function(req,res){
	res.render('index',{errors:[]});
});


module.exports = router;


