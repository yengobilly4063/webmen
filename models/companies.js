const Joi =  require("joi")
const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
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
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    websiteURL: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    isCompany: {
        type: Boolean,
        default: true,
        required: true
    }
})

const Company = mongoose.model("Company", companySchema)


validateCompany = (company) => {
    const companySchema = {
        name: Joi.string().required().min(5).max(255),
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(8).max(255),
        address: Joi.string().required().min(5).max(255),
        websiteURL: Joi.string().required().min(5).max(255),
        isCompany: Joi.boolean().default(true),
    }

    return Joi.validate(company, companySchema)
}

module.exports.Company = Company
module.exports.companySchema = companySchema
module.exports.validateCompany = validateCompany
