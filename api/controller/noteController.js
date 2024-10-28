const { ObjectId } = require("mongodb");
const Note = require("../model/noteModel");

/**
 * 
 * @method findAllNotes
 * @description  obtiene una lista de todas notas
 * @returns 
 */

exports.findAllNotes = async (req, res) => {
    try {
        console.log("Controller - req.data:", req.data);
        
        if (!req.data || !req.data._id) {
            return res.status(400).json({
                status: 400,
                message: "Invalid user data",
                data: null
            });
        }

        const note = new Note();
        const result = await note.getAllNotes({ userId: req.data._id });
        
        if (result.status === 204) {
            return res.status(204).send();
        }
        
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Controller error:", error);
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
exports.findNoteById = async (req, res) => {
    try {
        const note = new Note();
        const result = await note.getOneNoteById({
            id: req.params.id,  // ID de la nota que viene en la URL
            userId: new ObjectId({ userId: req.data._id }) // userId correcto
        });
        return res.status(result.status).json(result);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
};


/**
 * 
 * @method FindAllNoteByTitle
 * @description  Buscar nota por la descripcion o titulo
 * @returns 
 */
exports.FindAllNoteByTitle = async (req, res) => {
    try {
        const data = {
            userId: { userId: req.data._id },
            searchTerm: req.query.q?.trim()
        };

        if (!data.searchTerm) {
            return res.status(400).json({ 
                status: 400, 
                message: "Search term is required" 
            });
        }

        const note = new Note();
        const result = await note.searchNoteByTitleDescription(data);
        
        if (!result.data || result.data.length === 0) {
            return res.status(404).json({ 
                status: 404, 
                message: "No notes found matching the search criteria" 
            });
        }
        
        return res.status(200).json(result);
    } catch (error) {
        const err = typeof error.message === 'string' ? JSON.parse(error.message) : error;
        return res.status(err.status || 500).json(err);
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
exports.updateNote = async (req, res) => {
    try {
        const data = {
            userId: new ObjectId({ userId: req.data._id }),
            body: {
                ...req.body,
                date: new Date()
            },
            id: req.params.id
        };

        const note = new Note();
        
        console.log('Searching for note:', {
            userId: data.userId,
            noteId: data.id
        });
        const resultGet = await note.getOneNoteById({
            userId: data.userId,
            id: data.id
        });

        if(!resultGet.data) {
            return res.status(404).json({
                status: 404, 
                message: "Note not found"
            });
        }

        // Si la nota existe, procedemos a actualizarla
        let resultPut = await note.updateHistoryNote({
            _id: data.id,
            body: data.body,
            userId: data.userId
        });

        return res.status(resultPut.status).json(resultPut);
    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
};

/**
 * 
 * @method deleteNoteById
 * @description  Eliminar una nota
 */
exports.deleteNoteById = async (req, res) => {
    try {
      const noteId = req.params.id;
      const userId = { userId: req.data._id }; // ID exacto de la imagen
  
      console.log('Controller params:', {
        noteId,
        userId,
        noteIdObj: new ObjectId(noteId),
        userIdObj: new ObjectId(userId)
      });
  
      if (!noteId || !ObjectId.isValid(noteId)) {
        return res.status(400).json({
          status: 400,
          message: "Invalid note ID"
        });
      }
  
      const note = new Note();
      const resultDelete = await note.deleteNotesById(noteId, userId);
  
      return res.status(resultDelete.status).json(resultDelete);
  
    } catch (error) {
      console.error('Controller error:', error);
      return res.status(500).json({
        status: 500,
        message: "Error deleting note",
        error: error.message
      });
    }
  };


exports.save = async (req, res) => {
    try {
        let userId = { userId: req.data._id };
        const data = {
            userId: userId,
            body: { ...req.body }
        };

        // Validar los campos
        if (!data.body.title || typeof data.body.title !== 'string' || 
            !data.body.description || typeof data.body.description !== 'string') {
            return res.status(400).json({ 
                status: 400, 
                message: "Invalid title or description" 
            });
        }

        const note = new Note();
        let resultPOST = await note.save(data.userId, data.body);
        
        if (!resultPOST.data.acknowledged) {
            return res.status(406).json({ 
                status: 406, 
                message: "Note not saved" 
            });
        }

        let resultGET = await note.getOneNoteById({ 
            userId, 
            id: resultPOST.data.insertedId 
        });

        return res.status(201).json({ 
            status: 201, 
            message: "Note created", 
            data: resultGET.data 
        });

    } catch (error) {
        let err = JSON.parse(error.message);
        return res.status(err.status).json(err);
    }
};



