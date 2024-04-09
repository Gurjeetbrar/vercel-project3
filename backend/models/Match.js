const mongoose = require('mongoose');
const {Schema}= mongoose;
const MatchesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    id:{
        type: String,
        require: true
    }
  });
  module.exports = mongoose.model('matches', MatchesSchema)