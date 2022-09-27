const mongoose = require('mongoose')
const Schema = mongoose.Schema

const songSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    no: {
        type: Number,
        required: true
    },
    singer: {
        type: String,
        required: true
    },
    composer: {
        type: String,
        required: true
    },
    lyricist: {
        type: String,
        required: true
    },
    release: {
        type: Date,
        required: true
    },

})

module.exports = mongoose.model("song, songSchema")