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
        const data = {
            userId:"6718def84aa9a9e82f7b1f8b",
            ...req.params
        }
        const note = new Note();
        let result = await note.getOneNoteById(data);
        if(!result.message)return res.status(404).json({status:404,message:"note not found"})
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
    try {
        const data = {
            id_user: '6718def84aa9a9e82f7b1f8b',
            ...req.query
        }
        const note = new Note();
        let result = await note.searchNoteByTitleDescription(data);
        console.log(result.data.length);
    
        if (result.data.length == 0) return res.status(404).json({status: 404, message: "Note not found"});
        return res.status(result.status).json(result);
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

