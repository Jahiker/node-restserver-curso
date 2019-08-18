const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaCategoria } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

let app = express();

//=================================
//Obtener todos los productos
//=================================
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

//=================================
//Obtener un producto por ID
//=================================
app.get('/producto/:id', verificaToken, (req, res) => {
    id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro el producto'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//=================================
//Buscar un producto
//=================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

//=================================
//Crear un nuevo producto
//=================================
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        img: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//=================================
//Actualizar datos de un producto
//=================================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(100).json({
                    ok: false,
                    err: {
                        message: 'ID de producto invalido'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
});

//=================================
//Borrar un producto por ID
//=================================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(100).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto, ID invalido'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'producto borrado exitosamente'
        });
    });
});

module.exports = app;