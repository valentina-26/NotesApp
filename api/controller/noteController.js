const Note = require("../model/noteModel");

/**
 * 
 * @method findAllNotes
 * @description  obtiene una lista de todas notas
 * @returns 
 */
exports.findAllNotes = async ( req, res)=>{
    try{
        const note = new Note();
        let result = await note.getAllNotes();
        return res.status(result.status).json(result)
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method findNoteById
 * @description  obtiene una nota por medio del id
 * @returns 
 */
exports.findNoteById = async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method findNoteById
 * @description  obtiene una nota por medio del id
 * @returns 
 */
exports.findNoteById = async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method FindAllNoteByTitle
 * @description  Buscar nota por la descripcion o titulo
 * @returns 
 */
exports.FindAllNoteByTitle= async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method historyOfChanges
 * @description  obtener historial de cambios de una nota
 * TODO:solo admin
 */
exports.historyOfChanges= async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method save
 * @description  crear una nueva nota
 */
exports.save= async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method updateNoteById
 * @description  actualizar nota existente
 */
exports.updateNoteById= async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

/**
 * 
 * @method deleteNoteById
 * @description  Eliminar una nota
 */
exports.deleteNoteById= async ( req, res)=>{
    try{

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
}

