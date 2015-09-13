/**
  * Se define la tabla Capitulo de una serie de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla CapituloSerie en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('CapituloSerie',
      { 
            nombre:  { type: DataTypes.STRING, 
                     validate: {notEmpty: { msg:'El nombre de la serie es obligatorio'}}
                   },

            url: { type: DataTypes.STRING
             },
        
            puntuacion: {
                type: DataTypes.INTEGER
            }

        }         
        
      }
    );  
};