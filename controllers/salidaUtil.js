/**
  * Devuelve la salida en formato JSON. Es utilizada por la función saveVideo
  * @param res: Objeto de tipo Response
  * @param respuesta: Objeto que contiene la respuesta y que se
  *        convierte a JSON
  */
exports.devolverJSON = function(res,respuesta) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(respuesta));
    res.end();
};
