const express = require("express")
const router = express.Router()
const {Comment, validateComment} = require("../models/comments")
const {Mentor} = require("../models/mentors")
const {Student} = require("../models/students")
const {Project} = require("../models/projects")

router.get("/", async (req, res) => {
    const comments = await Comment.find()
    if(comments.length === 0) return res.status(400).send("No Comments found in database")

    res.send(comments)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const comment = await Comment.findById(id)

    if(!comment) return  res.status(400).send(`Comment with id ${id} not found`)

    res.send(comment)
})

router.post("/", async (req, res) => {

    const {error} = validateComment(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {content, userId, projectId} = req.body

    const user = await Mentor.findOne({_id: userId}) || await Student.findOne({_id: userId})
    if(!user) return res.status(400).send(`User with id ${userId} not found!`)

    const project = await Project.findOne({_id: projectId})
    if(!project) return res.status(400).send(`Project with id ${projectId} not found!`)


    const comment = new Comment({
        content, 
        project: {_id: project._id, name: project.name},
        user: {_id: user._id, name: user.name}
    })

    comment.save()

    res.send(comment)
})

router.delete("/:id", async (req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id)

    if(!comment) return res.status(400).send(`Comment with id ${req.params.id} not found!`)

    res.send(comment)
})









module.exports = router