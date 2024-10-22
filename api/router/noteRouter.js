const router = require("express").Router({mergeParams: true});
const notesController = require('../controller/noteController');
const historyController = require('../controller/historyController');
const versionMiddeleware = require('../middleware/versionate')

router.get("/search",versionMiddeleware("1.0.0"),  (req, res) => {
    notesController.FindAllNoteByTitle
});

router.get("/:id/history",versionMiddeleware("1.0.0"),  (req, res) => {
    notesController.historyOfChanges
});

router.get("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.findNoteById
});

router.get("/", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.findAllNotes
});


router.post("/:id/history", versionMiddeleware("1.0.0"), (req, res) => {
    historyController.save
});

router.post("/", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.save
});



router.put("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.updateNoteById
});

router.delete("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    notesController.deleteNoteById
});


module.exports = router
