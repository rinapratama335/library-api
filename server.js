const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

app.use(bodyParser());

const router = require("./src/routes/router");

app.use("/api/v1/", router);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
