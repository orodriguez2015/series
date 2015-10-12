/**
  * Función que renderiza la página de búsqueda de vídeos en youtube
  * @param req: Objeto request
  * @param res: Objeto response
  * @param next: Objeto next
  */
exports.show = function(req,res,next) { 
    console.log('mostrando videos');
    res.render("videos/search",{errors:[]});
};
