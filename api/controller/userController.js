const User = require("../model/userModel");
const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const fs = require('fs');


/**
 * 
 * @method AddNewUser
 * @description  crear un usuario 
 * TODO: devuelve un token con jwt
 */
exports.AddNewUser = async ( req, res)=>{
    try {
        const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 400, message: "Error in validating input data", data: errors.array() });
        let user = new User();
        req.body.password = await bcrypt.hash(req.body.password, 10)
        let resultPOST = await user.save(req.body);
        if(resultPOST.status == 200) return res.status(resultPOST.status).json(resultPOST);
        delete req.body.password;
        req.body._id = resultPOST.data.insertedId;
        const SECRET_KEY = fs.readFileSync('./certificate.cer');
        const token = jwt.sign(req.body, SECRET_KEY.toString('utf8'), { expiresIn: 1800000 });
        req.session.auth = token;
        return res.status(202).json({status: 202, message: "User created and logged in"})
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
      
}

/**
 * 
 * @method singInUser
 * @description  Permite al usuario iniciar sesion
 */
module.exports.signInUser = async (req, res) => {
    try {
        console.log("vhdsgjkhsdlg")
        let user = new User();
        let resultPOST = await user.login(req.body);
        if (resultPOST.status == 404) return res.status(resultPOST.status).json(resultPOST);
        req.body.password = await bcrypt.compare(req.body.password, resultPOST.data.password);
        if (!req.body.password) return res.status(401).json({ status: 401, message: "Incorrect password" });
        req.body = resultPOST.data;
        delete req.body.password;
        const SECRET_KEY = fs.readFileSync('./certificate.csr');
        const token = jwt.sign(req.body, SECRET_KEY.toString('utf8'), { expiresIn: 1800000 });
        req.session.auth = token;
        return res.status(202).json({ status: 202, message: "User logged in" });
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}


/**
 * 
 * @method logOutUser
 * @description  Permite al usuario cerrar sesion
 * TODO:opcional
 */
exports.logoutUser = async (req, res) => {
    try {
        const token = req.session.auth;
        const SECRET_KEY = fs.readFileSync('./certificate.csr');
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