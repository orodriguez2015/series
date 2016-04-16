/**
  * Se define la tabla pelicula de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla post en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('Pelicula',
      {
        titulo:  { type: DataTypes.STRING,
                     validate: {notEmpty: { msg:'El titulo de la película es obligatorio'}}
                   },

        descripcion:  { type: DataTypes.STRING },

        puntuacion: { type: DataTypes.INTEGER },

        visto: { type: DataTypes.INTEGER }

      }
    );
};
