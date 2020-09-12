const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const crystalSchema = new Schema({
  matchID: { type: String, unique: true, required: true }, //, unique: true
  battleID: { type: Number, "default" : false},
  battleFame: { type: Number },
  totalKills: { type: Number },
  level: { type: Number },
  team1Leader : { type: String },
  team2Leader : { type: String },
  startTime : { type: Date},
  team1Tickets : { type: Number },
  team2Tickets : { type: Number },
  players: { type : Array , "default" : [] },
  team2Timeline: { type : Array , "default" : [] },
  team1Timeline: { type : Array , "default" : [] },
  events: { type : Array},
})
crystalSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Crystal', crystalSchema)
