const Joi =  require("joi")
const mongoose = require("mongoose");
const { array } = require("../services/imageUpload");
Joi.objectId = require('joi-objectid')(Joi);

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    projectImage: {
        type: String
    },
    gitURL: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    backEndTech: {
        type: [String],
        required: true,
        min: 1
    },
    frontEndTech: {
        type: [String],
        required: true,
        min: 1
    },
    students: {
        type: [new mongoose.Schema({
            name: {type: String, required: true, min: 3, max: 255}
        })],
        min: 1, 
        max: 5
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
    },
    mentor: {
        type: new mongoose.Schema({
            name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255
            }
        }),
        required: true,
    }
})


const Project = mongoose.model("Project", projectSchema)


validateProject = (project) => {
    const projectSchema = {
        name: Joi.string().required().min(3).max(255),
        description: Joi.string().required().min(5).max(255),
        projectImage: Joi.string(),
        gitURL: Joi.string().required().min(5).max(255),
        backEndTech: Joi.string().required().required(),
        frontEndTech: Joi.string().required().required(),
        studentId: Joi.objectId(),
        companyId: Joi.objectId().required(),
        mentorId: Joi.objectId().required(),
    }

    return Joi.validate(project, projectSchema)
}



module.exports.Project = Project
module.exports.projectSchema = projectSchema
module.exports.validateProject = validateProject