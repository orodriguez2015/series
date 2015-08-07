
/**
  * Función que carga el formulario de alta de un nuevo 
  * usuario
  * @param: req: Objeto request
  * @param: res: Objeto response
  */
exports.new= function(req,res){

    console.log("Renderizado del formulario de alta de un nuevo formulario");
	res.render('users/new');

};