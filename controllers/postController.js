const tryCatch = require("../middleware/tryCatch");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const sendJwtToken = require("../utils/sendJwtToken");
const sendEmail = require("../utils/sendEmail");

/** Post  like Facebook  ⩢ */
exports.facebookPost = tryCatch(async (req, res, next) => {
  const { email, username, password } = req.body;
});
