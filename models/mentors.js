const Joi =  require("joi")
const mongoose = require("mongoose")
Joi.objectId = require('joi-objectid')(Joi);

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },
    canComment: {
        type: Boolean,
        default: true,
        required: true
    },
    company: {
        type: new mongoose.Schema({
            name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255
            }
        }),
        required: true
    }
})

const Mentor = mongoose.model("Mentor", mentorSchema)


validateMentor = (mentor) => {
    const mentorSchema = {
        name: Joi.string().required().min(5).max(255),
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(8).max(255),
        canComment: Joi.boolean().default(true),
        companyId: Joi.objectId().required()
    }

    return Joi.validate(mentor, mentorSchema)
}

module.exports.Mentor = Mentor
module.exports.mentorSchema = mentorSchema
module.exports.validateMentor = validateMentor
