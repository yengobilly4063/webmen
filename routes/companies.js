const express = require("express")
const router = express.Router()
const {Company, validateCompany} = require("../models/companies")
const bycrypt = require("bcrypt")


router.get("/", async (req, res) => {
    const companies = await Company.find()
    if(companies.length === 0) return res.status(400).send("No Companies found in database")

    res.send(companies)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const company = await Company.findById(id)

    if(!company) return  res.status(400).send(`Company with id ${id} not found`)

    res.send(company)
})

router.post("/", async (req, res) => {

    const {error} = validateCompany(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const companyExists = await Company.findOne({email: req.body.email})
    console.log(companyExists)
    if(companyExists) return res.status(400).send(`Company with email ${req.body.email} already exists`)

    const {name, email, password, address, websiteURL} = req.body

    const company = new Company({name, email, password, address, websiteURL, isCompany: true})

    company.password = await bycrypt.hash(company.password, 10)

    company.save()

    res.send(company)
})

router.put("/:id",  async (req, res) => {
    const {error} = validateCompany(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, email, password, address, websiteURL} = req.body

    const company = await Company.findByIdAndUpdate(req.params.id, {name, email, password, address, websiteURL}, {new: true})

    if(!company) return res.status(400).send(`Company with id ${req.params.id} Not found!`)

    res.send(company)
})

router.delete("/:id",  async (req, res) => {
    const company = await Company.findByIdAndDelete(req.params.id)

    if(!company) return res.status(400).send(`Company with id ${req.params.id} Not found!`)

    res.send(company)

})


module.exports = router
