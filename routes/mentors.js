const express = require("express")
const router = express.Router()
const {Mentor, validateMentor} = require("../models/mentors")
const {Company} = require("../models/companies")
const bycrypt = require("bcrypt")

router.get("/", async (req, res) => {
    const mentors = await Mentor.find()
    if(mentors.length === 0) return res.status(400).send("No mentors found in database")

    res.send(mentors)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const mentor = await Mentor.findById(id)

    if(!mentor) return  res.status(400).send(`Mentor with id ${id} not found`)

    res.send(mentor)
})

router.post("/", async (req, res) => {

    const {error} = validateMentor(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, email, password, companyId} = req.body

    const mentorExists = await Mentor.findOne({email: req.body.email})
    if(mentorExists) return res.status(400).send(`Mentor with email ${req.body.email} already exists`)

    const company = await Company.findById(companyId)
    if(!company) return res.status(400).send(`No Company with id ${companyId} found!`)
    

    const mentor = new Mentor({name, email, password, canComment: true, company: {
        _id: company._id,
        name: company.name
    }})

    mentor.password = await bycrypt.hash(mentor.password, 10)

    mentor.save()

    res.send(mentor)
})

router.put("/:id",  async (req, res) => {
    const {error} = validateMentor(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, email, password} = req.body

    const mentor = await Mentor.findByIdAndUpdate(req.params.id, {name, email, password}, {new: true})

    if(!mentor) return res.status(400).send(`Mentor with id ${req.params.id} Not found!`)

    res.send(mentor)
})

router.delete("/:id",  async (req, res) => {
    const mentor = await Mentor.findByIdAndDelete(req.params.id)

    if(!mentor) return res.status(400).send(`Mentor with id ${req.params.id} Not found!`)

    res.send(mentor)

})


module.exports = router