const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./connections/database");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("./routes/getProposalRoutes");
app.use("/api", routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.error(`Connected to port ${port}`);
});
