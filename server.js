const express = require("express")
const app = express()
const morgan = require("morgan")
const commentRoutes = require("./routes/comments")
const universityRoutes = require("./routes/universities")
const mentorRoutes = require("./routes/mentors")
const companyRoutes = require("./routes/companies")
const studentRoutes = require("./routes/students")
const projectRoutes = require("./routes/projects")
const auth = require("./routes/auth")
const mongoose = require("mongoose")


//db connection
mongoose
    .connect('mongodb://localhost/webmen', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('Connected to MongoDb');
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB...', err);
    });

app.use(morgan("dev"))
app.use(express.json());
app.use("/api/comments/", commentRoutes)
app.use("/api/universities/", universityRoutes)
app.use("/api/mentors/", mentorRoutes)
app.use("/api/companies/", companyRoutes)
app.use("/api/students/", studentRoutes)
app.use("/api/projects/", projectRoutes)
app.use("/api/auth/", auth)





const PORT = 3000
app.listen(PORT, () => {
    console.log(`Listening on port  ${PORT}`)
})

