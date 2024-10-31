const User = require("../model/userModel");
const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
// const fs = require('fs');


/**
 * 
 * @method AddNewUser
 * @description  crear un usuario 
 * TODO: devuelve un token con jwt
 */
exports.AddNewUser = async (req, res) => {
    console.log("dfgvbhjnkm")
    try {
        let user = new User();
        req.body.password = await bcrypt.hash(req.body.password, 10);
        let resultPOST = await user.save(req.body);
        if (resultPOST.status === 200) {
            return res.status(resultPOST.status).json(resultPOST);
        }
        const userData = {
            _id: resultPOST.data.insertedId,
            nickName: req.body.nickName,
            email: req.body.email
        };
        const SECRET_KEY = process.env.EXPRESS_SECRET_KEY;
        const token = jwt.sign(userData, SECRET_KEY, { 
            expiresIn: '30m'
        });
        if (!req.session) {
            req.session = {};
        }
        req.session.auth = token;
        return res.status(201).json({
            status: 201,
            message: "Usuario creado y sesión iniciada",
            token: token // Opcional: enviar token al cliente
        });

    } catch (error) {
        console.error('Error completo:', error);
        let errorResponse;
        try {
            errorResponse = JSON.parse(error.message);
        } catch (parseError) {
            errorResponse = {
                status: 500,
                message: "Error interno del servidor",
                error: error.message
            };
        }

        return res.status(errorResponse.status || 500).json(errorResponse);
    }
};

/**
 * 
 * @method singInUser
 * @description  Permite al usuario iniciar sesion
 */
exports.signInUser = async (req, res) => {
    try {
        const user = new User();
        const result = await user.login(req.body);

        if (result.status === 404) {
            return res.status(404).json({
                status: 404,
                message: "Usuario no encontrado"
            });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(req.body.password, result.data.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 401,
                message: "Contraseña incorrecta"
            });
        }

        // Crear token
        // const SECRET_KEY = fs.readFileSync('./certificate.csr', 'utf8');
        const SECRET_KEY = process.env.EXPRESS_SECRET_KEY
        const token = jwt.sign({
            _id: result.data._id,
            nickName: result.data.nickName,
            email: result.data.email
        }, SECRET_KEY, { expiresIn: '30m' });

        // Guardar en sesión
        req.session.auth = token;
        req.session.userId = result.data._id;

        // Forzar guardado de sesión
        return new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    console.error('Error al guardar sesión:', err);
                    reject(err);
                }
                
                console.log('Sesión guardada:', req.session);
                resolve(res.status(200).json({
                    status: 200,
                    message: "Login exitoso",
                    token: token
                }));
            });
        });

    } catch (error) {
        console.error('Error en login:', error);
        const errorResponse = {
            status: 500,
            message: "Error en el servidor",
            error: error.message
        };
        return res.status(500).json(errorResponse);
    }
};


























/**
 * 
 * @method logOutUser
 * @description  Permite al usuario cerrar sesion
 * TODO:opcional
 */
exports.logoutUser = async (req, res) => {
    try {
        const token = req.session.auth;
        
        const SECRET_KEY = process.env.EXPRESS_SECRET_KEY// const SECRET_KEY = fs.readFileSync('./certificate.csr');
        const decoded = jwt.verify(token, SECRET_KEY.toString('utf8'));
        const { exp, iat, ...payload } = decoded;
        const newToken = jwt.sign(payload, SECRET_KEY.toString('utf8'), { expiresIn: -9999 });
        req.session.auth = newToken;
        req.session.auth.maxAge = .1 * 60 * 1000;
        return res.status(200).json({ status: 200, message: "User logged out" });
    } catch (error) {
        return res.status(500).json(err);
    }
}
























/**
 * 
 * @method updateUserById
 * @description  Permite actualizar info de usuario
 * TODO:opcional
 */
exports.updateUserById = async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method deleteUserById
 * @description  Permite eliminar usuario
 * TODO:opcional
 */
exports.deleteUserById = async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}