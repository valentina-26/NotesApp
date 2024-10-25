const Connect = require('../helper/connect')
const { ObjectId } = require('mongodb'); 

class Note extends Connect {
    constructor() {
      super();
    }
  
    async getAllNotes(userId) {
      try {
        const { status, message, data: db } = await this.getConnect();
        const collection = db.collection('nota');
        const result = await collection.aggregate([
          {
            $match: {
              status: "visible",
              userId: new ObjectId(userId)  
            }
          },
          {
            $project: {
              _id: 0,
              result: {
                $cond: {
                  if: { $gt: [{ $size: "$changes" }, 1] },
                  then: {
                    $mergeObjects: [
                      "$$ROOT",
                      { $arrayElemAt: ["$changes", -1] }
                    ]
                  },
                  else: "$$ROOT"
                }
              }
            }
          },
          {
            $replaceRoot: { newRoot: "$result" }
          },
          {
            $project: {
              userId: 0,
              changes: 0,
              status: 0
            }
          },
          {
            $addFields: {
              date: {
                $cond: {
                  if: { $eq: ["$date", null] },
                  then: { $toDate: "$_id" },
                  else: "$date"
                }
              }
            }
          }
        ]).toArray();
        return { status: 200, message: "List of notes obtained", data: result };
      } catch (error) {
        throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error.message }));
      }
    }

    async getOneNoteById(userId, id) {
      try {
        const { status, message, data: db } = await this.getConnect();
        const collection = db.collection('nota');
        const [result] = await collection.aggregate([
          {
            $match: {
              _id: new ObjectId(id),  
              status: "visible",
              userId: new ObjectId(userId)  
            }
          },
          {
            $project: {
              _id: 0,
              result: {
                $cond: {
                  if: { $gt: [{ $size: "$changes" }, 1] },
                  then: {
                    $mergeObjects: [
                      "$$ROOT",
                      { $arrayElemAt: ["$changes", -1] }
                    ]
                  },
                  else: "$$ROOT"
                }
              }
            }
          },
          {
            $replaceRoot: { newRoot: "$result" }
          },
          {
            $project: {
              userId: 0,
              changes: 0,
              status: 0
            }
          },
          {
            $addFields: {
              date: {
                $cond: {
                  if: { $eq: ["$date", null] },
                  then: { $toDate: "$_id" },
                  else: "$date"
                }
              }
            }
          }
        ]).toArray();

        if (!result.length) {
          return { status: 404, message: "Note not found", data: null };
        }

        return { status: 200, message: "Note obtained successfully", data: result[0] };
      } catch (error) {
        throw new Error(JSON.stringify({ status: 500, message: "Error getting note", data: error.message }));
      }
    }

    async searchNoteByTitleDescription(userId, q) {
  try {
    const { status, message, data: db } = await this.getConnect();
    const collection = db.collection('nota');
    const result = await collection.aggregate([
      {
        $match: {
          status: "visible",
          userId: new ObjectId(userId)  
        }
      },
      {
        $project: {
          _id: 0,
          result: {
            $cond: {
              if: { $gt: [{ $size: "$changes" }, 1] },
              then: {
                $mergeObjects: [
                  "$$ROOT",
                  { $arrayElemAt: ["$changes", -1] }
                ]
              },
              else: "$$ROOT"
            }
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$result" }
      },
      {
        $project: {
          userId: 0,
          changes: 0,
          status: 0
        }
      },
      {
        $addFields: {
          date: {
            $cond: {
              if: { $eq: ["$date", null] },
              then: { $toDate: "$_id" },
              else: "$date"
            }
          }
        }
      }
    ]).toArray();

    // Convertimos el texto a buscar a minúsculas para hacer una búsqueda insensible a mayúsculas
    const texto = q.toLowerCase();

    // Filtramos el arreglo para encontrar coincidencias
    const resultCoincidence = result.filter(item =>
      item.title.toLowerCase().includes(texto) ||
      item.description.toLowerCase().includes(texto)
    );

    return { status: 200, message: "List of notes obtained", data: resultCoincidence };
  } catch (error) {
    throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
  }
}

async updateHistoryNote(_id, body, id_user) {
  try {
      
      const { status, message, data: db } = await this.getConnect();
      const collection = db.collection('nota');
      const result = await collection.updateOne(
          {
              _id: new ObjectId(_id),
              usuario_id: new ObjectId(id_user)
          },
          { $push: { changes: body } }
      );
      return { status: 214, message: "note updated", data: result };
  } catch (error) {
      throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
  }
}

async deleteNotesById(_id_user, id) {
  try {
      const { status, message, data: db } = await this.getConnect();
      const collection = db.collection('nota');
      const result = await collection.updateOne(
          {
              _id: new ObjectId(id),
              usuario_id: new ObjectId(_id_user)
          },
          { $set: { status: "not visible" } }
      );
      return { status: 200, message: "Note deleted", data: result };
  } catch (error) {
      throw new Error(JSON.stringify({ status: 500, message: "Error deleted note", data: error }));
  }
}

async save(usuario_id, body) {
  try {
      const { status, message, data: db } = await this.getConnect();
      const collection = db.collection('nota');
      const result = await collection.insertOne(body);
      return { status: 201, message: "Note saved", data: result }
  } catch (error) {
      throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
  }
}

}

module.exports = Note;