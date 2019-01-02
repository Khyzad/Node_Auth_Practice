const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    text: {
        type: String,
    },
    comments: [{
        type: String
    }],
    tags: [{
        type: String,
    }],
    edited: {
        type: Boolean,
    }
})

const Post = module.exports = mongoose.model('Post', PostSchema);