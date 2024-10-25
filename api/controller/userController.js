const User = require("../model/userModel");
const bcryptjs = require("bcryptjs");
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
        let user = new User();
        req.body.password = await bcrypt.hash(req.body.password, 10)
        let resultPOST = await user.save(req.body);
        if(resultPOST.status == 201) return res.status(resultPOST.status).json(resultPOST);
        delete req.body.password;
        req.body._id = data.insertedId;
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
exports.singInUser = async ( req, res)=>{
    try{

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
exports.logOutUser = async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
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