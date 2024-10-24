const Connect = require('../helper/connect')
const { ObjectId } = require('mongodb'); 

class Note extends Connect {
    constructor() {
      super();
    }
  
    async updateHistoryNoteById(_id, body,) {
        try {
            body.date = new Date()
            const { status, message, data: db } = await this.getConnect();
            const collection = db.collection('nota');
            const result = await collection.updateOne(
                {
                    _id: new ObjectId(_id),
                },
                { $push: { changes: body } }
            );
            return { status: 201, message: "History note updated", data: result };
        } catch (error) {
            throw new Error(JSON.stringify({ status: 500, message: "Error getting all notes", data: error }));
        }
    }
    
}
