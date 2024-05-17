"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const mongoose = require('mongoose')
const mongoose_1 = __importDefault(require("mongoose"));
// const courses = require('./routes/courses')
const patients = require('./routes/patients');
mongoose_1.default.connect("mongodb://localhost/Hospital")
    .then(() => console.log("connected to mongo db..."))
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
// app.use('/api/courses',courses)
app.use('/api/patients', patients);
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
