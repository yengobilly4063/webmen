const express = require("express")
const router = express.Router()
const {University} = require("../models/universities")
const {Student, validateStudent} = require("../models/students")
const imageUpload = require("../services/imageUpload")
const bycrypt = require("bcrypt")
const _ = require("lodash")


router.get("/", async (req, res) => {
    const students = await Student.find()
    if(students.length === 0) return res.status(400).send("No Students found in database")

    res.send(students)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const student = await Student.findById(id).select("-password")

    if(!student) return  res.status(400).send(`Student with id ${id} not found`)

    res.send(_.pick(student, ["_id", "firstName", "lastName", "email", "progileImageURL", "university"]))
})

router.post("/", imageUpload.single("profileImageURL"), async (req, res) => {

    const {error} = validateStudent(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {firstName, lastName, email, password, universityId} = req.body
    if(req.file) profileImageURL = req.file.path

    const studentExists = await Student.findOne({email: req.body.email})
    if(studentExists) return res.status(400).send(`Student with email ${req.body.email} already exists`)

    const university = await University.findById(universityId)
    if(!university) return res.status(400).send(`No University with id ${universityId} found!`)


    const student = new Student({firstName, lastName, name: `${firstName} ${lastName}`,  email, password, canComment: true, profileImageURL,  university: {
        _id: university._id,
        name: university.name
    }})

    student.password = await bycrypt.hash(student.password, 10)

    student.save()

    res.send(_.pick(student, ["_id", "firstName", "lastName", "email", "progileImageURL", "university"]))
})

router.put("/:id", imageUpload.single("profileImageURL"), async (req, res) => {

    const {error} = validateStudent(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {firstName, lastName, email, password, universityId} = req.body
    if(req.file) profileImageURL = req.file.path

    const university = await University.findById(universityId)
    if(!university) return res.status(400).send(`No University with id ${universityId} found!`)
    

    const student = await Student.findByIdAndUpdate(req.params.id, {firstName, lastName, email, password, profileImageURL, university: {
        _id: university._id,
        name: university.name
    }})

    res.send(_.pick(student, ["_id", "firstName", "lastName", "email", "progileImageURL", "university"]))
})

router.delete("/:id", async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id)

    if(!student) return res.status(400).send(`Student with id ${req.params.id} Not found!`)

    res.send(_.pick(student, ["_id", "firstName", "lastName", "email", "progileImageURL", "university"]))
})

    




module.exports = router