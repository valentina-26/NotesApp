const Connect = require('../helper/connect')

class Note extends Connect {
    constructor() {
      super();
    }
  
    async getAllNotes() {
      try {
        const { status, message, data: db } = await this.getConnect();
        const collection = db.collection('Notes');
        const result = await collection.find({changes:0}).toArray();
        return { status: 200, message: "List of notes obtained", data: result };
      } catch (error) {
        throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
      }
    }
  }

module.exports = Note;
  