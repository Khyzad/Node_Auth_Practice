const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    author: {
        type: String,        
    },
    text: {
        type: String,
    },
    comments:[{
        PostId: {
            type: String,
        }
    }],
    tags:[{
        tagname: String,
    }],
    edited:{
        type: Boolean,
    }
})

const Post = module.exports = mongoose.model('Post', PostSchema);