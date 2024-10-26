const Connect = require('../helper/connect');
const { ObjectId } = require('mongodb');

class Note extends Connect {
  constructor() {
    super();
  }

  async getAllNotes(userId) {
    try {
      const { status, message, data: db } = await this.getConnect();
      const collection = db.collection('nota');
      
       
        // Debug: Mostrar el userId que estamos buscando
        console.log("userId que estamos buscando:", userId);
        console.log("Tipo de userId que buscamos:", typeof userId.userId);
        console.log("Valor de userId que buscamos:", userId.userId.toString());

        // Obtener todos los documentos y mostrar sus userIds
        const allDocs = await collection.find({}).toArray();
        console.log("UserIds en la base de datos:");
        allDocs.forEach(doc => {
            console.log({
                docId: doc._id.toString(),
                userId: doc.userId.toString(),
                matches: doc.userId.toString() === userId.userId.toString()
            });
        });

        // Intenta buscar con el userId directamente
        const userDocs = await collection.find({ 
            userId: userId.userId 
        }).toArray();
        console.log("Documentos encontrados con userId:", userDocs.length);

      const result = await collection.aggregate([
        {
          $match: {
            status: "visible",
            userId: userId.userId
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
  
      console.log("Resultado de la consulta:", result);
      return { status: 200, message: "List of notes obtained", data: result };
    } catch (error) {
      throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error.message }));
    }
  }
  

  async getOneNoteById({ userId, id }) {
    try {
        const { status, message, data: db } = await this.getConnect();
        const collection = db.collection('nota');
        
        const [result] = await collection.aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    status: "visible",
                    userId: userId
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

        if (!result) {
            return { 
                status: 404, 
                message: "Note not found", 
                data: null 
            };
        }

        return { 
            status: 200, 
            message: "Note obtained successfully", 
            data: result 
        };
    } catch (error) {
        throw new Error(JSON.stringify({ 
            status: 500, 
            message: "Error getting note", 
            data: error.message 
        }));
    }
}

async searchNoteByTitleDescription({ userId, searchTerm }) {
  try {
      const { status, message, data: db } = await this.getConnect();
      const collection = db.collection('nota');

      const searchRegex = new RegExp(searchTerm, 'i');

      const result = await collection.aggregate([
          {
              $match: {
                  status: "visible",
                  userId: new ObjectId(userId)
              }
          },
          {
              $addFields: {
                  lastChange: {
                      $cond: {
                          if: { $gt: [{ $size: "$changes" }, 1] },
                          then: { $arrayElemAt: ["$changes", -1] },
                          else: "$$ROOT"
                      }
                  }
              }
          },
          {
              $replaceRoot: {
                  newRoot: {
                      $mergeObjects: [
                          "$$ROOT",
                          "$lastChange"
                      ]
                  }
              }
          },
          {
              $match: {
                  $or: [
                      { title: { $regex: searchRegex } },
                      { description: { $regex: searchRegex } }
                  ]
              }
          },
          {
              $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  date: {
                      $cond: {
                          if: { $eq: ["$date", null] },
                          then: { $toDate: "$_id" },
                          else: "$date"
                      }
                  }
              }
          },
          {
              $sort: { date: -1 } // Ordenar por fecha, más reciente primero
          }
      ]).toArray();

      return {
          status: 200,
          message: `Found ${result.length} notes matching the search criteria`,
          data: result
      };
  } catch (error) {
      console.error('Search error:', error);
      throw new Error(JSON.stringify({
          status: 500,
          message: "Error searching notes",
          data: error.message
      }));
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
      return { status: 214, message: "Note updated", data: result };
    } catch (error) {
      throw new Error(JSON.stringify({ status: 500, message: "Error updating note", data: error.message }));
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
      throw new Error(JSON.stringify({ status: 500, message: "Error deleting note", data: error.message }));
    }
  }

  async save(usuario_id, body) {
    try {
      const { status, message, data: db } = await this.getConnect();
      const collection = db.collection('nota');

      // Asegúrate de incluir el usuario_id en el documento
      const noteToInsert = { ...body, usuario_id: new ObjectId(usuario_id) };
      const result = await collection.insertOne(noteToInsert);

      return { status: 201, message: "Note saved", data: result };
    } catch (error) {
      throw new Error(JSON.stringify({ status: 500, message: "Error saving note", data: error.message }));
    }
  }
}

module.exports = Note;
