const router = require("express").Router({ mergeParams: true });
const notesController = require('../controller/noteController');
const historyController = require('../controller/historyController');
const versionMiddeleware = require('../middleware/versionate');

// Buscar notas
router.get("/search", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.FindAllNoteByTitle(req, res);
});

// Historial de notas
// router.get("/:id/history", versionMiddeleware("1.0.0"), (req, res) => {
//     historyController.rgtrtter(req, res);
// });

// Obtener nota específica
router.get("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.findNoteById(req, res);
});

// Obtener todas las notas
router.get("/", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.findAllNotes(req, res);
});

// Nueva versión nota
router.post("/:id/history", versionMiddeleware("1.0.0"), (req, res) => {
    historyController.updateHistoryNote(req, res);
});

// Crear nota
router.post("/", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.save(req, res);
});

// Actualizar nota
router.put("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.updateNote(req, res);
});

// Eliminar nota
router.delete("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.deleteNoteById(req, res);
});

module.exports = router;
