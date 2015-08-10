var express = require('express');
var router = express.Router();

var usersController = require('../controllers/user_controller.js');


// GET /users/new. Carga el formulario de alta de un nuevo usuario
router.get('/users/new',usersController.new);

// POST /users/create. Da de alta un usuario en la base de datos, siempre y cuando no exista
router.post('/users/create',usersController.create);


router.get('/',function(req,res){
	res.render('index',{errors:[]});
});


module.exports = router;
