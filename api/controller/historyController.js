const History = require("../model/historyModel");


/**
 * 
 * @method save
 * @description  guardar nueva version de la nota
 */
exports.updateHistoryNote = async (req, res) => {
    try {
      const data = {
        body: { ...req.body },
        id: req.params.id
      };
      data.body.date = new Date()
      const history = new History();
      let result = await history.updateHistoryNoteById(data);
      if (result.data.length == 0)
        return res.status(404).json({ status: 404, message: "Note not found" });
      return res.status(result.status).json(result);
    } catch (error) {
      let err = JSON.parse(error.message);
      return res.status(err.status).json(err);
    }
  };
  
