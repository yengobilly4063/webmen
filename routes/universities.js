const express = require("express")
const router = express.Router()
const {University, validateUniversity} = require("../models/universities")


router.get("/", async (req, res) => {
    const universities = await University.find()
    if(universities.length === 0) return res.status(400).send("No Universities found in database")
    res.send(universities)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const university = await University.findById(id)

    if(!university) return res.status(400).send(`University with id ${id} not found`)

    res.send(university)
})



router.post("/", (req, res) => {

    const {error} = validateUniversity(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    const university = new University({name: req.body.name})
    university.save()

    res.send(university)
})

router.put("/:id",  async (req, res) => {
    const {error} = validateUniversity(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name} = req.body

    const university = await University.findByIdAndUpdate(req.params.id, {name}, {new: true})

    if(!university) return res.status(400).send(`University with id ${req.params.id} Not found!`)

    res.send(university)
})

router.delete("/:id",  async (req, res) => {
    const university = await University.findByIdAndDelete(req.params.id)

    if(!university) return res.status(400).send(`University with id ${req.params.id} Not found!`)

    res.send(university)

})






module.exports = router