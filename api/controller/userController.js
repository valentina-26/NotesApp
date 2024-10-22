/**
 * 
 * @method AddNewUser
 * @description  crear un usuario 
 * TODO: devuelve un token con jwt
 */
exports.AddNewUser = async ( req, res)=>{
    try{

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