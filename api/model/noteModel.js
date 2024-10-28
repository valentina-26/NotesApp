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
          
          // Convertir el userId a ObjectId
          const userObjectId = new ObjectId(userId.userId);
          
          console.log("\n=== DEBUG INFORMACIÓN ===");
          console.log("1. userId recibido:", userId);
          console.log("1.1 userId convertido a ObjectId:", userObjectId);
          
          // Verificar documentos existentes
          const allDocs = await collection.find({}).limit(5).toArray();
          console.log("2. Muestra de documentos en la colección:", 
              allDocs.map(doc => ({
                  _id: doc._id,
                  userId: doc.userId,
                  status: doc.status
              }))
          );
  
          // Búsqueda específica con ObjectId
          const simpleFind = await collection.find({ 
              userId: userObjectId,
              status: "visible" 
          }).toArray();
          console.log("3. Búsqueda simple:", simpleFind.length, "documentos encontrados");
  
          // Realizar la agregación con pipeline modificado usando ObjectId
          const result = await collection.aggregate([
              {
                  $match: {
                      $and: [
                          { userId: userObjectId },
                          { status: { $eq: "visible" } }
                      ]
                  }
              },
              {
                  $project: {
                      _id: 0,
                      result: {
                          $cond: {
                              if: { $gt: [{ $ifNull: [{ $size: { $ifNull: ["$changes", []] } }, 0] }, 1] },
                              then: {
                                  $mergeObjects: [
                                      "$$ROOT",
                                      { 
                                          $ifNull: [
                                              { $arrayElemAt: ["$changes", -1] },
                                              {}
                                          ]
                                      }
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
                              if: { $eq: [{ $ifNull: ["$date", null] }, null] },
                              then: { $toDate: "$_id" },
                              else: { $toDate: "$date" }
                          }
                      }
                  }
              }
          ]).toArray();
  
          console.log("4. Resultado final de la agregación:", result.length, "documentos");
          
          if (!result || result.length === 0) {
              console.log("5. No se encontraron notas para el usuario");
              return {
                  status: 204,
                  message: "No notes found for this user",
                  data: []
              };
          }
  
          console.log("=== FIN DEBUG ===\n");
  
          return {
              status: 200,
              message: "List of notes obtained",
              data: result
          };
  
      } catch (error) {
          console.error("\n=== ERROR DEBUG ===");
          console.error("Error completo:", error);
          console.error("=== FIN ERROR DEBUG ===\n");
          
          // Si el error es de conversión de ObjectId, devolver un mensaje más claro
          if (error.message.includes("ObjectId")) {
              throw new Error(JSON.stringify({
                  status: 400,
                  message: "Invalid user ID format",
                  data: error.message
              }));
          }
          
          throw new Error(JSON.stringify({
              status: 500,
              message: "Error getting all notes",
              data: error.message
          }));
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

async updateHistoryNote({ _id, body, userId }) {
  try {
      const { data: db } = await this.getConnect();
      const collection = db.collection('nota');

      // Comprobar si la nota existe primero
      console.log('Updating note:', {
        _id,
        userId,
        body
    });
      const noteExists = await collection.findOne({
          _id: new ObjectId(_id),
          userId: new ObjectId(userId),
          status: "visible"
      });

      if (!noteExists) {
          throw new Error(JSON.stringify({
              status: 404,
              message: "Note not found"
          }));
      }

      // Si la nota existe, actualizar
      const result = await collection.updateOne(
          {
              _id: new ObjectId(_id),
              userId: new ObjectId(userId),
              status: "visible"
          },
          {
              $push: {
                  changes: {
                      title: body.title,
                      description: body.description,
                      date: body.date
                  }
              }
          }
      );

      if (result.modifiedCount === 0) {
          throw new Error(JSON.stringify({
              status: 400,
              message: "No changes were made to the note"
          }));
      }

      return {
          status: 200,
          message: "Note updated successfully",
          data: {
              _id: _id,
              ...body
          }
      };
  } catch (error) {
      if (error.message.includes("status")) {
          throw error;
      }
      throw new Error(JSON.stringify({
          status: 500,
          message: "Error updating note",
          data: error.message
      }));
  }
}

async deleteNotesById(noteId, userId) {
    try {
      const { data: db } = await this.getConnect();
      const collection = db.collection('nota');
      
      // Log para debugging
      console.log('Searching with:', {
        noteId: noteId,
        userId: userId,
        searchCriteria: {
          _id: new ObjectId(noteId),
          userId: userId,
          status: "visible"
        }
      });
  
      const result = await collection.updateOne(
        {
          _id: new ObjectId(noteId),
          userId: new ObjectId(userId), // Convertimos userId a ObjectId
          status: "visible"
        },
        {
          $set: { 
            status: "not visible"
          }
        }
      );
  
      console.log('Update result:', result); // Log del resultado
  
      if (result.matchedCount === 0) {
        // Verificamos por qué no se encontró
        const note = await collection.findOne({ _id: new ObjectId(noteId) });
        console.log('Note state:', note);
        
        return {
          status: 404,
          message: "Note not found or already deleted"
        };
      }
  
      return {
        status: 200,
        message: "Note deleted successfully",
        data: {
          id: noteId,
          modified: result.modifiedCount
        }
      };
  
    } catch (error) {
      console.error('Model error:', error);
      throw new Error("Error deleting note: " + error.message);
    }
  }
  







async save(userId, body) {
    try {
        const { data: db } = await this.getConnect();
        const collection = db.collection('nota');

        // Validar tipos de datos
        if (typeof body.title !== 'string' || typeof body.description !== 'string') {
            throw new Error(JSON.stringify({
                status: 400,
                message: "Invalid data types for title or description"
            }));
        }

        const noteToInsert = {
            title: body.title,
            description: body.description,
            userId: new ObjectId(userId),
            status: "visible",
            changes: []
        };

        const result = await collection.insertOne(noteToInsert);
        
        return {
            data: result
        };

    } catch (error) {
        throw new Error(JSON.stringify({
            status: 500,
            message: error.message
        }));
    }
}
}

module.exports = Note;
