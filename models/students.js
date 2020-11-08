const Joi =  require("joi")
const mongoose = require("mongoose")
Joi.objectId = require('joi-objectid')(Joi);

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    name: {
        type: String,
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
    isStudent: {
        type: Boolean,
        default: true,
        required: true
    },
    canComment: {
        type: Boolean,
        default: true,
        required: true
    },
    profileImageURL: {
        type: String,
    },
    university: {
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

const Student = mongoose.model("Student", studentSchema)


validateStudent = (student) => {
    const studentSchema = {
        firstName: Joi.string().required().min(3).max(255),
        lastName: Joi.string().required().min(3).max(255),
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(8).max(255),
        canComment: Joi.boolean().default(true),
        universityId: Joi.objectId().required()
    }

    return Joi.validate(student, studentSchema)
}

module.exports.Student = Student
module.exports.studentSchema = studentSchema
module.exports.validateStudent = validateStudent
