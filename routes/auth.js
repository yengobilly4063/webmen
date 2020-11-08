const express = require("express")
const router = express.Router()
const {Mentor} = require("../models/mentors")
const {Student} = require("../models/students")
const {Company} = require("../models/companies")
const _ = require("lodash")
const bcrypt = require("bcrypt")
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const config = require("config")

router.post("/", async (req, res) => {
    const {error} = validateUserLogin(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await (Company.findOne({email: req.body.email}) || Mentor.findOne({email: req.body.email}) || Student.findOne({email: req.body.email}))
    if(!user) return res.status(400).send(`invalid user email ${req.body.email}`)

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send(`invalid user password`)

    const token = generateAuthToken(user)

    res.send(token)
})


router.get("/me", async (req, res) =>{
    const user = await (Company.findById(req.body._id) ||  Mentor.findById(req.body._id) || Student.findById(req.body._id)).select("-password")
    res.send(user)
})



validateUserLogin = (user) => {
  
    const loginSchema = {
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(8).max(255),
    }

    return Joi.validate(user, loginSchema);
}


generateAuthToken = (user) => {
    const token = jwt.sign({_id: user._id, email: user.email, password: user.password}, config.get("jwtPrivateKey")) 
    return token
}


module.exports = router