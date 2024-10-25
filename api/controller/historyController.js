const History = require("../model/historyModel");

/**
 * @method updateHistoryNote
 * @description Guardar nueva versión de la nota
 */
exports.updateHistoryNote = async (req, res) => {
  try {
    const noteId = req.params.id; // Obtén el ID de los parámetros
    if (!noteId) {
      return res.status(400).json({ status: 400, message: "Note ID is required" });
    }

    const body = { ...req.body, date: new Date() }; // Agregar la fecha al cuerpo de la nota
    const history = new History();
    const result = await history.updateHistoryNoteById(noteId, body); // Llama al método con los parámetros adecuados

    // Verifica si se actualizó algo
    if (result.data.modifiedCount === 0) {
      return res.status(404).json({ status: 404, message: "Note not found" });
    }

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating history note:", error); // Imprime el error en la consola para depuración
    let errResponse;
    try {
      errResponse = JSON.parse(error.message); // Intenta parsear el mensaje de error
    } catch {
      errResponse = { status: 500, message: "Internal server error" }; // Si no se puede parsear, retorna un error genérico
    }
    return res.status(errResponse.status || 500).json(errResponse);
  }
};
