/**
  * Se define la tabla Categoria de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla Categoria en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('Categoria',
      { 
        nombre:  { type: DataTypes.STRING, 
                     validate: {notEmpty: { msg:'El nombre de la categoría es obligatorio'}}
                 }
      }
    );  
};