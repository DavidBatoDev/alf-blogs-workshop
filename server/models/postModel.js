const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, "Please add a title"]
    },
    author: {
        type: String,
    },
    content: {
        type: String,
        require: [true, "Please add a content"]
    },
    cover_photo: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Post', postSchema);