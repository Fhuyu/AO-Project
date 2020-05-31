const mongoose = require('mongoose')
const Schema = mongoose.Schema

const guildSchema = new Schema({
    guildID: { type: String, unique: true },
    guildName: { type: String},
})

module.exports = mongoose.model('Guild', guildSchema)
