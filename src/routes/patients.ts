import mongoose, {Schema} from "mongoose"
import express, {Request, Response} from "express";

const router = express.Router();
// const Joi = require("joi");
import Joi from "joi"


const patientSchema = new mongoose.Schema({
    petName:
        {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 20
        },
    petType: {
        type: String,
        enum: ["cat", "dog", "bird"],
        lowercase: true,
        required: true
    },
    ownerName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 20
    },
    ownerAddress: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 40
    },
    ownerPhoneNumber: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        validate: {
            validator: function (v: string) {
                return v && v.length >= 11 && v.length < 12 // Ensuring it contains exactly 12 digits
            },
            message:  'ownerPhoneNumber is not a valid 11-digit phone number!'
        },
    }
});

const Patient = mongoose.model("Patient", patientSchema);


//getting all patients 
router.get("/", async (req: Request, res: Response) => {

    const patient = await Patient.find();
    res.send(patient);
});


//add a new patient
router.post("/", async (req: Request, res: Response) => {

    //validating data before inserting in db
    const {error} = ValidatePatient(req.body) // object destructuring

    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {

        console.log(req.body)
        const {petName, petType, ownerName, ownerAddress, ownerPhoneNumber} = req.body;

        // Create a new patient instance
        const newPatient = new Patient({
            petName,
            petType,
            ownerName,
            ownerAddress,
            ownerPhoneNumber,

        });

        // Save the new patient to the database
        const savedPatient = await newPatient.save();

        res.status(201).json(savedPatient);
    }
    catch (error)
    {
        console.error("Error adding patient:", error);
        res.status(500).json({error: "Could not add patient"});
    }
});

//updating 
router.put('/:id', async (req, res) => {

    const { error } = ValidatePatient(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params;

    try {
        const { petName, petType, ownerName, ownerAddress, ownerPhoneNumber } = req.body;

        // Find the patient by ID
        let patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Update patient properties
        patient.petName = petName;
        patient.petType = petType;
        patient.ownerName = ownerName;
        patient.ownerAddress = ownerAddress;
        patient.ownerPhoneNumber = ownerPhoneNumber;

        // Save the updated patient
        const updatedPatient = await patient.save();

        res.json(updatedPatient);

    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ error: "Could not update patient" });
    }
});

//delete
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Find the patient by ID and delete it
        const deletedPatient = await Patient.findByIdAndDelete(id);

        if (!deletedPatient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({ message: "Patient deleted successfully", deletedPatient });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ error: "Could not delete patient" });
    }
});

function ValidatePatient(patient: any) {
    const schema = Joi.object({
        petName: Joi.string().min(5).required(),
        petType: Joi.string().required(),
        ownerName: Joi.string().min(5).required(),
        ownerAddress: Joi.string().min(5).required(),
        ownerPhoneNumber: Joi.string().length(11).required()
    });
    return schema.validate(patient);
}

module.exports = router;
