const Connect = require('../helper/connect')
const { ObjectId } = require('mongodb'); 

class Note extends Connect {
    constructor() {
      super();
    }
  
    async updateHirtoryNoteById({ id, data,userId }) {
        try {
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('nota');
            const result = await collectiondb.update(
                { _id: new ObjectId(id) },
                { $push: { changes: data } }
            );
            return { status: 200, message: "List of notes obtained", data: result };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    
}