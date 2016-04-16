/**
  En este archivo se crea la BBDD y se exporta los objeto que trabajan
  con las tablas que la forman **/

var path = require('path');

// URL POSTGRESQL  postgres://xanvvmotjozllo:2ZY1IpqoQZ6Lzw0kkRQ5-ThXU5@ec2-23-23-188-252.compute-1.amazonaws.com:5432/d8jl7qmlc3njgn
// URL SQLITE      sqlite://:@:/

// Con process.env se obtiene los datos del entorno, en local como tenemos
// el archivo .env se toman los datos del entorno local.
// En heroku, ya existe la variable de entorno DATABASE_URL

console.log("process.env.DATABASE_URL: " + process.env.DATABASE_URL);
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user    = (url[2] || null);
var pwd     = (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port    = (url[5] || null);
var host    = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;


console.log("url: " + url);
console.log("DB_name: " + DB_name);
console.log("user: " + user);
console.log("pwd: " + pwd);
console.log("protocol: " + protocol);
console.log("dialect: " + dialect);
console.log("port: " + port);
console.log("host: " + host);
console.log("storage: " + storage);
console.log("");

// Se carga el modelo ORM
var Sequelize = require('sequelize');

// Se indica a sequelize que se usa una BBDD sqllite y se da un nombre a la misma
var sequelize  = new Sequelize(DB_name, user, pwd,
  { dialect: dialect,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // Sólo para sqllite
    omitNull: true    // Sólo postgresql
  }
 );



// Se importa la definición de la tabla User del archivo user.js
var User = sequelize.import(path.join(__dirname, 'user'));
// Se importa la definición de la tabla Serie del archivo serie.js
var Serie = sequelize.import(path.join(__dirname, 'serie'));
// Se importa la definición de la tabla Categoria del archivo categoria.js
var Categoria = sequelize.import(path.join(__dirname, 'categoria'));
// Se importa la definición de la tabla CapituloSerie del archivo capituloSerie.js
//var CapituloSerie = sequelize.import(path.join(__dirname, 'capituloSerie'));
// Se importa la definición de la tabla Temporada del archivo temporada.js
//var Temporada = sequelize.import(path.join(__dirname, 'temporada'));
// Se importa la definición de la tabla UsuarioVisualizaSerie
//var UsuarioVisualizaSerie = sequelize.import(path.join(__dirname, 'usuarioVisualizaSerie'));
// Se importa la definición de la tabla de BBDD VideoYoutube
var VideoYoutube = sequelize.import(path.join(__dirname, 'VideoYoutube'));
// Se importa la definición de la tabla de BBDD CategoriaVideoYoutube
var CategoriaVideoYoutube = sequelize.import(path.join(__dirname, 'CategoriaVideoYoutube'));
// Se importa la definición de la tabla de BBDD Post
var Post = sequelize.import(path.join(__dirname, 'post'));
// Se importa la definición de la tabla de BBDD Peliculaº
var Pelicula = sequelize.import(path.join(__dirname, 'Pelicula'));

/*
// Se define la relación 1:N entre la tabla serie y user. Un usuario
// puede dar de alta 0:N series
Serie.belongsTo(User);
// Se indica el nombre de la foreign key. Sino se indica nada, por defecto sería UserId
User.hasMany(Serie,{foreignKey:'UserId'});
*/



// Un usuario puede dar de alta varias películas
Pelicula.belongsTo(User);
User.hasMany(Pelicula,{foreignKey:'UserId'})

// Se indica el nombre de la foreign key. Sino se indica nada, por defecto sería CategoriaId
Categoria.hasMany(Serie,{foreignKey: 'CategoriaId'} );
// Una serie tiene una categoría asociada, la relación entre la seri y la categoria se llamará Categoria
Serie.belongsTo(Categoria,{as: 'Categoria', foreignKey: 'CategoriaId'});

/*
// Una serie de compone de 1 a N temporadas. Una temporada es de 1 serie
Temporada.belongsTo(Serie,{as: 'Serie', foreignKey: 'SerieId'});
Serie.hasMany(Temporada,{foreignKey: 'SerieId'});
*/

/*
// Un temporada de una serie, se compone de 1 a N capítulos
CapituloSerie.belongsTo(Temporada,{as: 'Temporada', foreignKey: 'TemporadaId'});
Temporada.hasMany(CapituloSerie,{foreignKey: 'TemporadaId'} );
*/

/*
// Relación M:N entre la tabla User y CapituloSerie, de modo que un usuario puede
// haber visualizado múltiples capítulos de una serie, y un capítulo de una serie
// puede haber sido visualizado por múltiples usuarios
User.hasMany(CapituloSerie, {
    as: 'UsuarioVeCapitulo',
    through: UsuarioVisualizaSerie, //this can be string or a model,
    foreignKey: 'UserId'
});
*/


// Se define la relación 1:N entre la tabla serie y user. Un usuario
// puede dar de alta 0:N videos de youtube
VideoYoutube.belongsTo(User);
// Un usuario puede haber almacenado de 1 a N vídeos
User.hasMany(VideoYoutube,{foreignKey:'UserId'});



// Se define la relación 1:N entre la tabla User y CategoriaVideoYoutube
CategoriaVideoYoutube.belongsTo(User);
// Un usuario puede haber almacenado de 1 a N vídeos
User.hasMany(CategoriaVideoYoutube,{foreignKey:'UserId'});



// Se define la relación 1:N entre la tabla CategoriaVideoYoutube y VideoYoutube
VideoYoutube.belongsTo(CategoriaVideoYoutube);
// Un usuario puede haber almacenado de 1 a N vídeos
CategoriaVideoYoutube.hasMany(VideoYoutube,{foreignKey:'CategoriaVideoYoutubeId'});


// Un usuario puede dar de alta varios post
Post.belongsTo(User);
User.hasMany(Post,{foreignKey:'UserId'})






// Se exporta la definición de las tabla de la base de datos
exports.User  = User;
exports.Serie = Serie;
exports.Categoria = Categoria;
//exports.CapituloSerie = CapituloSerie;
//exports.Temporada = Temporada;
//exports.UsuarioVisualizaSerie = UsuarioVisualizaSerie;
exports.VideoYoutube = VideoYoutube;
exports.CategoriaVideoYoutube = CategoriaVideoYoutube;
exports.Post = Post;
exports.Pelicula = Pelicula;


/**
  * Esta llamada crea e inicializa la base de datos videoclub.sqllite.
  * Además si la tabla QUIZ no tiene valores, entonces, se inserta uno por defecto.
  * Se hace uso de promesas utilizando la función then, que se ejecuta
  * cuando se ejecutado correctamente el método sync(), y la promesa catch en caso
  * de que se haya producido un error
  */
sequelize.sync().then(function(data) {

   console.log("BASE DE DATOS CREADA");

}).catch(function(err){
   console.log(" ERROR AL CREAR LA BASE DE DATOS: " + err.message);
});
