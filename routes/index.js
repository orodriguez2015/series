var express = require('express');
var router = express.Router();

var usersController = require('../controllers/user_controller.js');


if(usersController!=undefined)
	console.log("!= undefined");
else
	console.log("= undefined");

// GET /users/new. Carga el formulario de alta de un nuevo usuario
router.get('/users/new',usersController.new);


router.get('/',function(req,res){
	res.render('index',{errors:[]});
});


module.exports = router;
