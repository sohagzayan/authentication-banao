const tryCatch = require("../middleware/tryCatch");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/** register user  ⩢ */
exports.registerUser = tryCatch(async (req, res, next) => {
  console.log("hello world");
});
