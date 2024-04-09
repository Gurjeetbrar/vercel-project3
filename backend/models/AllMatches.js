const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});
const TeamsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  team: {
    type: [TeamSchema],
    required: true
  }
});

const MatchesSchema = new Schema({

  Teams:{
    type: [TeamsSchema],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type:{
    type: String, 
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
});

const AllMatches = mongoose.model('AllMatches', MatchesSchema);
module.exports = AllMatches;
