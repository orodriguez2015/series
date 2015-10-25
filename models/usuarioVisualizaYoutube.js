/**
  * Se define la tabla UsuarioVisualizaYoutube de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla User en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('UsuarioVisualizaYoutube',
      { 
        // Puntuación que el usuario le da al vídeo
        puntuacion: {
          type: DataTypes.STRING
        }
        
      }
    );  
};
