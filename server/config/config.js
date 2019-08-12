//=============================
//PUERTO
//=============================

process.env.PORT = process.env.PORT || 3000;

//=============================
//ENTRONO
//=============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============================
//VENCIMINETO
//=============================
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=============================
//SEED DE AUTENTICACION
//=============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=============================
//BASE DE DATOS
//=============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
    //urlDB = 'mongodb+srv://jahiker:wB6.gdyKKSZF9@cluster0-qarre.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

//=============================
//GOOGLE CLIENT ID
//=============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '649140161611-sonj1np8octpbu44ej5qg22po3t190ff.apps.googleusercontent.com'