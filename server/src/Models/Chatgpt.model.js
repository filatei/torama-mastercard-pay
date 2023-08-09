const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatgptSchema = new Schema({
    prompt: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        required: true
    },
    context: {
        type: String
    }    
},
  {
    timestamps: true
  })

const Chatgpt = mongoose.model('chatgpt', ChatgptSchema);
module.exports = Chatgpt;