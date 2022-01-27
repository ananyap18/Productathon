const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const messageSchema = new mongoose.Schema({
    sentBy: {
      type: ObjectId,
      ref: "user"
    },
    recievedBy: {
      type: ObjectId,
      ref: "user"
    },
    body:{
      type: String,
      required: true,
    }
})

const Message = mongoose.model("message", messageSchema);

module.exports = Message;