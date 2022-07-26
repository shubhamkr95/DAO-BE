const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { dbConnect } = require("./connections/database");
const { proposalData } = require("./models/proposals");
const cors = require("cors");

const app = express();
app.use(cors());
app.get("/api/proposalHash", async (req, res, next) => {
 const dataID = await proposalData.find();

 console.log(dataID);
 res.status(200).json(dataID);

 next();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.error(`Connected to port ${port}`);
});
