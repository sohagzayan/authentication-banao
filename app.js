const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const errorHandlerGard = require("./middleware/error");

dotenv.config({ path: "config/config.env" });

/* user external middleware */
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

/* Route import */
const user = require("./routes/userRoute");

app.use("/api", user);

// middleware  error handler
app.use(errorHandlerGard);

module.exports = app;
