import express from "express";
import mongoose from "mongoose"
const patients = require('./routes/patients')

mongoose.connect("mongodb://localhost/Hospital")
.then(()=> console.log("connected to mongo db..."))
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express()
app.use(express.json());
const port = 3000
app.use('/api/patients',patients)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})