const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const path = require('path');

const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//middleWare opciones por defecto
app.use(fileUpload());

//modificar archivos en el servidor
app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se cargaron archivos'
            }
        });
    }

    //Validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo No Valido! Los tipos validos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    console.log(`Se cargo un atrchivo de extension ${extension}`);

    //Extensiones de archivos permitidas
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension No Valida! Las  Extensiones validas son: ' + extensionesValidas.join(', ')
            }
        });
    }

    //Cambio de nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

//Funcion para guardar o reemplazar la imagen de usuario
function imagenUsuario(id, res, nombreArchivo) {
    //Se busca el usuario segun el ID proporcionado
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Usuario no existe'
                }
            });
        }
        //Se borra el archivo anterior para mantener una unica imagen
        borraArchivo(usuarioDB.img, 'usuarios');
        //Se guarda la nueva imagen de usuario
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });
        });
    });
}

//Funcion para guardar o reemplazar la imagen de usuario
function imagenProducto(id, res, nombreArchivo) {
    //Se busca el usuario segun el ID proporcionado
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        }
        //Se borra el archivo anterior para mantener una unica imagen
        borraArchivo(productoDB.img, 'productos');
        //Se guarda la nueva imagen de usuario
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });
        });
    });
}

//Funcion para borrar un archivo de la carpeta uploads
function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;