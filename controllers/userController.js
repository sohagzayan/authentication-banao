const tryCatch = require("../middleware/tryCatch");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const sendJwtToken = require("../utils/sendJwtToken");
const sendEmail = require("../utils/sendEmail");

/** register user  ⩢ */
exports.registerUser = tryCatch(async (req, res, next) => {
  const { email, username, password } = req.body;
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    return next(new ErrorHandler("Email already exists", 400));
  }
  const isUsernameExists = await User.findOne({ username });
  if (isUsernameExists) {
    return next(new ErrorHandler("Username already exists", 400));
  }
  /* make a hash password ⩢  */
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
  });
  const user = await User.findOne({ _id: newUser._id });
  /** Get jwt token and store token on cookie  ⩢  */
  sendJwtToken(user, 200, res);
});

/** login  user  ⩢ */
exports.login = tryCatch(async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  let isUser;
  if (emailOrUsername.includes("@")) {
    isUser = await User.findOne({ email: emailOrUsername });
  } else {
    isUser = await User.findOne({ username: emailOrUsername });
  }
  if (!isUser) {
    return next(new ErrorHandler("Email or username not found", 400));
  }
  /** Check user password is isValid ⩢ */
  const isPasswordValid = await bcrypt.compare(password, isUser.password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid user email or password"));
  }
  sendJwtToken(isUser, 200, res);
});

/** logout  user  ⩢ */
exports.logout = tryCatch(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

/** logout  user  ⩢ */
exports.forgotPassword = tryCatch(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("user not found", 400));
  }
  const resetToken = user.getResetPassword();
  await user.save({ validateBeforeSave: false });
  const message = `your password reset token is :- \n\n ${resetToken} \n\n If you are not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Billing application password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

/** reset Password  ⩢ */
exports.resetPassword = tryCatch(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  const hashPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  sendJwtToken(user, 200, res);
});
