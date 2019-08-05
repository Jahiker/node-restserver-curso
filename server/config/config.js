//=============================
//PUERTO
//=============================

process.env.PORT = process.env.PORT || 3000;

//=============================
//ENTRONO
//=============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============================
//BASE DE DATOS
//=============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URLDB;
}

process.env.URLDB = urlDB;