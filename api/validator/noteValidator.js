const { body, param, query } = require("express-validator");
const { ObjectId } = require("mongodb");

exports.saveNoteValidation = () => {
    return [
        body("title")
            .notEmpty().withMessage("El título es un campo obligatorio.")
            .isString().withMessage("El título debe ser texto.")
            .trim()
            .isLength({ min: 1, max: 200 }).withMessage("El título debe tener entre 1 y 200 caracteres."),
        
        body("description")
            .notEmpty().withMessage("La descripción es un campo obligatorio.")
            .isString().withMessage("La descripción debe ser texto.")
            .trim()
            .isLength({ min: 1, max: 2000 }).withMessage("La descripción debe tener entre 1 y 2000 caracteres.")
    ];
};

exports.updateNoteValidation = () => {
    return [
        param("_id")
            .notEmpty().withMessage("El ID de la nota es obligatorio.")
            .custom(value => ObjectId.isValid(value)).withMessage("El ID de la nota no es válido."),
            
        body("title")
            .optional()
            .isString().withMessage("El título debe ser texto.")
            .trim()
            .isLength({ min: 1, max: 200 }).withMessage("El título debe tener entre 1 y 200 caracteres."),
            
        body("description")
            .optional()
            .isString().withMessage("La descripción debe ser texto.")
            .trim()
            .isLength({ min: 1, max: 2000 }).withMessage("La descripción debe tener entre 1 y 2000 caracteres."),
            
        body("date")
            .optional()
            .isISO8601().withMessage("La fecha debe estar en formato ISO8601.")
    ];
};

exports.deleteNoteValidation = () => {
    return [
        param("noteId")
            .notEmpty().withMessage("El ID de la nota es obligatorio.")
            .custom(value => ObjectId.isValid(value)).withMessage("El ID de la nota no es válido.")
    ];
};

exports.getNoteByIdValidation = () => {
    return [
        param("id")
            .notEmpty().withMessage("El ID de la nota es obligatorio.")
            .custom(value => ObjectId.isValid(value)).withMessage("El ID de la nota no es válido.")
    ];
};

exports.searchNoteValidation = () => {
    return [
        query("searchTerm")
            .notEmpty().withMessage("El término de búsqueda es obligatorio.")
            .isString().withMessage("El término de búsqueda debe ser texto.")
            .trim()
            .isLength({ min: 1, max: 100 }).withMessage("El término de búsqueda debe tener entre 1 y 100 caracteres.")
    ];
};

exports.getAllNotesValidation = () => {
    return [
        query("userId")
            .optional()
            .custom(value => ObjectId.isValid(value)).withMessage("El ID de usuario no es válido.")
    ];
};
