const mongoose = require('mongoose')

const Schema = mongoose.Schema

const petSchema = new Schema({
    name: {type: String, required: true},
    breed: {type: String, required: true},
    dob: {type: Date, required: true},
    gender: {type: String, required: true},
    description: {type: String, required: true},
    openForBreeding: {type: Boolean, required: true},
    image: {type: String, required: true},
    creatorId: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model('Pet', petSchema)