/**
  * Se define la tabla Serie de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla User en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('Serie',
      { 
        nombre:  { type: DataTypes.STRING, 
                     validate: {notEmpty: { msg:'El nombre de la serie es obligatorio'}}
                   },

        descripcion: { type: DataTypes.STRING, 
                    validate: { notEmpty: { msg: 'La descripción de la serie es obligatoria'}}

        } ,
        
        idUsuario: { 
                type: DataTypes.INTEGER,
                validate: {notEmpty: { msg:'El id del usuario que da alta el capítulo es obligatorio'}}
        }
        
      }
    );  
};
