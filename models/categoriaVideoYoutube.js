/**
  * Se define la tabla CategoriaVideoYoutube para poder agrupar por categorías los vídeos
  * de youtube favoritos de un usuario
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    return sequelize.define('CategoriaVideoYoutube',
      { 
        nombre:  { type: DataTypes.STRING, 
                     validate: {notEmpty: { msg:'El nombre de la categoría es obligatorio'}}
                 },
        
        descripcion:  { type: DataTypes.STRING, 
                     validate: {notEmpty: { msg:'La descripción de la categoría es obligatoria'}}
                 }
      }
    );  
};