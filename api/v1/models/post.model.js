const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:String,
    author:String,
    thumbnail:String,
    description:String,
    category:String,
    content:String,
    createdAt: Date,
    deleted:{
        type: Boolean,
        default: false
    },
    deletedAt:Date,
    deletedBy:String
    },{
        timestamps:true
    }
);

const Post = mongoose.model("Post", postSchema, "posts");

module.exports = Post;