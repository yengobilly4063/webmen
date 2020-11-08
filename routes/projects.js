const express = require("express")
const router = express.Router()
const {Project, validateProject} = require("../models/projects")
const {Company} = require("../models/companies")
const imageUpload = require("../services/imageUpload")
const { Mentor } = require("../models/mentors")
const { Student } = require("../models/students")


router.get("/", async (req, res) => {
    const projects = await Project.find()
    if(projects.length === 0) return res.status(400).send("No Projects found in database")

    res.send("Project")
})

router.get("/:id", async (req, res) => {
    const project = await Project.findById(req.params.id)
    if(!project) return res.status(400).send(`Project with id ${req.params.id} not found!`)

    res.send(project)
})



router.post("/", imageUpload.single("projectImage"),  async (req, res) => {
    const {error} = validateProject(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, description, gitURL, backEndTech, frontEndTech, companyId, mentorId} = req.body
    if(req.file) projectImage = req.file.path

    const projectExists = await Project.findOne({name})
    if(projectExists) return res.status(400).send(`Project with name ${name} already exists`)

    const company = await Company.findById(companyId)
    if(!company) return res.status(400).send(`Company with id ${companyId} not found!!`)

    const mentor = await Mentor.findById(mentorId)
    if(!mentor) return res.status(400).send(`Mentor with id ${mentorId} not found!!`)

    const project = new Project({name, description, gitURL, backEndTech: backEndTech.split(","), projectImage, frontEndTech: frontEndTech.split(","), 
        company: {
        _id: company._id,
        name: company.name
        },
        mentor: {
            _id: mentor._id,
            name: mentor.name
        }
    })

    project.save()

    res.send(project)
})

router.put("/:id", imageUpload.single("projectImage"),  async (req, res) => {
    const {error} = validateProject(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, description, gitURL, backEndTech, frontEndTech, companyId, mentorId, studentId} = req.body
    if(req.file) projectImage = req.file.path

    const backend = backEndTech.split(",")
    const frontend = frontEndTech.split(",")

    const company = await Company.findById(companyId)
    if(!company) return res.status(400).send(`Company with id ${companyId} not found!!`)

    const mentor = await Mentor.findById(mentorId)
    if(!mentor) return res.status(400).send(`Mentor with id ${mentorId} not found!!`)

    const student = await Student.findById(studentId)
    if(!student) return res.status(400).send(`Student with id ${studentId} not found!!`)

    const oldProject = await Project.findById(req.params.id)
    if(!oldProject) res.status(400).send(`Project with id ${req.params.id} not found!!`)

    const students = oldProject.students
    

    const newProject = await Project.findByIdAndUpdate(req.params.id, {name, description, gitURL, backEndTech: backEndTech.split(","), 
        frontEndTech: frontEndTech.split(","),  projectImage, 
        company: {
            _id: company._id,
            name: company.name
        },
        mentor: {
            _id: mentor._id,
            name: mentor.name
        },
        students: students.concat({_id: student._id, name: `${student.firstName} ${student.lastName}`})
    })
    

    res.send(newProject)
})

router.delete("/:id", async (req, res) => {
    const project = await Project.findByIdAndDelete(req.params.id)

    if(!project) return res.status(400).send(`Project with id ${req.params.id} Not found!`)

    res.send(project)
})




module.exports = router
