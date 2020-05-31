const mongoose = require('mongoose')
const Schema = mongoose.Schema

const battleSchema = new Schema({
  battleID: { type: Number, unique: true },
  battleStartTime: { type: Date},
  battleData: {type: [Object], blackbox: true },
})

module.exports = mongoose.model('Battle', battleSchema)
