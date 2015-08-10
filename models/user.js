/**
  * Se define la tabla User de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla User en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('User',
      { 
        login:  { type: DataTypes.STRING, 
                     validate: {notEmpty: { msg:'El login es obligatorio'}}
                   },

        password: { type: DataTypes.STRING, 
                    validate: { notEmpty: { msg: 'El password es obligatorio'}}

        },

        nombre: { type: DataTypes.STRING, 
                    validate: { notEmpty: { msg: 'El nombre es obligatorio'}}
        },

        apellido1: {
          type: DataTypes.STRING,
          validate: { notEmpty: { msg: 'El primer apellido es obligatorio'}}

        },

        apellido2: {
          type: DataTypes.STRING
        },

        email: {
          type: DataTypes.STRING,
          validate: { notEmpty: { msg: 'El email es obligatorio'}}
        }

      }
    );  
};
