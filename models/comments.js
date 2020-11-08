const Joi = require("joi")
const mongoose = require("mongoose")
Joi.objectId = require('joi-objectid')(Joi);


const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255
        },
        user: new mongoose.Schema({
            name: {
                type: String,
                required: true
            }
        }),
        project: new mongoose.Schema({
            name: {
                type: String,
                required: true
            }
        })
    }
)

const Comment = mongoose.model("Comment", commentSchema)

validateComment = (comment) => {
    const commentSchema = {
        content: Joi.string().required().min(5).max(255),
        userId: Joi.objectId().required(),
        projectId: Joi.objectId().required(),
    }

    return Joi.validate(comment, commentSchema)
}


module.exports.commentSchema = commentSchema;
module.exports.Comment = Comment;
module.exports.validateComment = validateComment;