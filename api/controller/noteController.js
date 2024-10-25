const Note = require("../model/noteModel");

/**
 * 
 * @method findAllNotes
 * @description  obtiene una lista de todas notas
 * @returns 
 */
exports.findAllNotes = async ( req, res)=>{
    try {
        const note = new Note();
        let result = await note.getAllNotes({userId : "6718def84aa9a9e82f7b1f8b"});
        return res.status(result.status).json(result);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
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



/**
 * 
 * @method updateNoteById
 * @description  actualizar nota existente
 */
exports.updateNote= async ( req, res)=>{
    try {
        const data = {
            userId: '6718e1584aa9a9e82f7b1f9f',
            body: {...req.body},
            id: req.params.id
        };
        data.body.date = new Date()
        const note = new Note();
        let resultGet = await note.getOneNoteById(data);
        if(!resultGet.data) return res.status(404).json({status: 404, message: "Note not found"});
        
        let resultPut = await note.updateHistoryNote(data);
        return res.status(resultPut.status).json(resultPut);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}

/**
 * 
 * @method deleteNoteById
 * @description  Eliminar una nota
 */
exports.deleteNoteById= async ( req, res)=>{
    try {
        const data = {
            id_user: '6718e1584aa9a9e82f7b1f9f',
            id: req.params.id
        };
        
        let note = new Note();
        let resultGet = await note.getOneNoteById(data);
        if(!resultGet.data) return res.status(214).json({status: 214, message: "Note updated"});
        
        let resultDelete = await note.deleteNotesById(data);
        return res.status(resultDelete.status).json(resultDelete);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }
}

exports.save = async(req, res)=>{
    try {
        let id_user = '6718e1584aa9a9e82f7b1f9f';
        const data = {
            usuario_id: id_user,
            body: {...req.body}
        };
        data.body.usuario_id = new ObjectId(id_user);
        data.body.changes = [];
        data.body.status = "visible";
        const note = new Note();
        let resultPOST = await note.save(data);
        if(!resultPOST.data.acknowledged) return res.status(406).json({status: 406, message: "Note not saved"});
        let resultGET = await note.getOneNoteById({id_user, id:resultPOST.data.insertedId});
        return res.status(201).json({status: 201, message: "Note created", data: resultGET.data});
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err)
    }

}

