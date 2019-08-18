const jwt = require('jsonwebtoken');

//=============================
//VERIFICAR TOKEN
//=============================
let verificaToken = (req, res, netx) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token No Valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        netx();
    });
    //res.json({
    //  token: token
    //});
    //console.log(token);
}

//=============================
//VERIFICAR ADMINROLE
//=============================
let verificaAdminRole = (req, res, netx) => {
        let usuario = req.usuario;
        if (req.usuario.role != 'ADMIN_ROLE') {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El Usuario No es Administrador'
                }
            });
        }
        netx();
    }
    //=======================================================
    //verificacion a manera de prueba no incluida en el curso
    //=======================================================
let verificaCategoria = (req, res, netx) => {
    let categoria = req.categoria;
    if (!req.categoria.descripcion) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La categoria no es valida'
            }
        });
    }
    netx();
}

//====================================
//VERIFICAR TOKEN POR URL PARA IMAGEN
//====================================
let verificaTokenImg = (req, res, netx) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token No Valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        netx();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg,
    verificaCategoria
}