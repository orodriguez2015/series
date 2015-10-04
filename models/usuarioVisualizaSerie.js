/**
  * Se define la tabla UsuarioVisualizaSerie que almacena un registro para indicar
  * si un usuario determinado del sistema, a visualizado o no un determinado capítulo de una serie
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("UsuarioVisualizaSerie", {
      
   puntuacion: {
        type:DataTypes.INTEGER   
   }
  });
};