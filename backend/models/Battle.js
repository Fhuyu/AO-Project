const mongoose = require('mongoose')
const Schema = mongoose.Schema

const battleSchema = new Schema({
  battleID: { type: Number, unique: true },
  battleStartTime: { type: Date},
  battleTotalPlayers : { type: Number},
  battleData: {type: [Object], blackbox: true },
})

module.exports = mongoose.model('Battle', battleSchema)
