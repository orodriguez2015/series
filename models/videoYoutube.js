/**
  * Se define la tabla VideoYoutube de la BBDD
  * @param sequelize: Objeto de tipo Sequelize
  * @param DataTypes: Objeto DataTypes con los tipos de datos de campos
                      de base de datos, con los que trabaja sequelize.js
  */                      
module.exports = function(sequelize,DataTypes){

    // Al definir los atributos de la tabla User en el objeto ORM que lo representa,
    // se pueden introducir validaciones en sus campos
    return sequelize.define('VideoYoutube',
      { 
        idVideo:  { type: DataTypes.STRING, 
                     validate: {notEmpty: { msg:'El id el video es obligatorio'}}
                   },

        idCanal: { type: DataTypes.STRING, 
                    validate: { notEmpty: { msg: 'El id del canal es obligatorio'}}

        },
        
        descCanal: { type: DataTypes.STRING, 
                    validate: { notEmpty: { msg: 'La descripción del canal es obligatorio'}}
        },
    
        tituloVideo: {
          type: DataTypes.STRING,
          validate: { notEmpty: { msg: 'El título del vídeo es obligatorio'}}
        },
        
        descripcionVideo: {
          type: DataTypes.STRING,
          validate: { notEmpty: { msg: 'El título del vídeo es obligatorio'}}
        },

        urlImagen: {
          type: DataTypes.STRING,
          validate: { notEmpty: { msg: 'El título del vídeo es obligatorio'}}
        }
        
      }
    );  
};
