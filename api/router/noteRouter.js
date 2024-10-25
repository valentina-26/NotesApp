const router = require("express").Router({mergeParams: true});
const notesController = require('../controller/noteController');
const historyController = require('../controller/historyController');

const versionMiddeleware = require('../middleware/versionate')
//buscar notas
router.get("/search",versionMiddeleware("1.0.0"),  (req, res) => {
    notesController.FindAllNoteByTitle
});
//historial de notas
/*router.get("/:id/history",versionMiddeleware("1.0.0"),  (req, res) => {
    notesController.rgtrtter
});*/
//obtener nota especifica
router.get("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.findNoteById
});
//obtener todas las notas
router.get("/", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.findAllNotes
});

//nueva version nota
router.post("/:id/history", versionMiddeleware("1.0.0"), (req, res) => {
    historyController.updateHistoryNote
});

//crear nota
router.post("/", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.save
});


//actualizar nota
router.put("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.updateNote
});

//eliminar nota
router.delete("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.deleteNoteById
});


module.exports = router
