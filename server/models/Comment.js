const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types 

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  reacts: [{
    createdBy: {
      type: ObjectId,
      ref: "user"
    },
    reaction: {
      type: String
      // => good, ok, bad
    }
  }],
  commentedBy: {
    type: ObjectId,
    ref: "user"
  },
  commentedOn: {
    type: ObjectId,
    ref: "post"
  }
}, {timestamps: true})

module.exports = mongoose.model('comment', commentSchema)