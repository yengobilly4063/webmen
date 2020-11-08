const Joi =  require("joi")
const mongoose = require("mongoose")

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
})

const University = mongoose.model("University", universitySchema)


validateUniversity = (university) => {
    const universitySchema = {
        name: Joi.string().required().min(5).max(255)
    }

    return Joi.validate(university, universitySchema)
}

module.exports.University = University
module.exports.universitySchema = universitySchema
module.exports.validateUniversity = validateUniversity
