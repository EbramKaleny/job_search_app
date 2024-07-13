import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import userModel from "../db/models/user.js";
import { sendEmail } from "../services/sendEmail.js";
import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import applicationModel from "../db/models/application.js";
import { customAlphabet } from "nanoid";

// @desc    sign up new user
// @route   POST /users/signup
// @roles  "User","Company_HR"
export const signUp = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;
  const exists = await userModel.findOne({ email });
  if (exists) {
    next(new appError("email already exists", 400));
  }
  const hash = bcrypt.hashSync(password, Number(process.env.saltRound));
  await userModel.create({
    firstName,
    lastName,
    email,
    password: hash,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  });
  res.status(200).json({ msg: "done" });
});

// @desc    sign in user
// @route   PUT /users/signin
// @roles  "User","Company_HR"
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, mobileNumber, recoveryEmail, password } = req.body;
  let user;
  if (email) {
    user = await userModel.findOne({ email });
  } else if (mobileNumber) {
    user = await userModel.findOne({ mobileNumber });
  } else if (recoveryEmail) {
    user = await userModel.findOne({ recoveryEmail });
  }
  const compare = bcrypt.compareSync(password, user.password);
  if (!user || !compare) {
    next(new appError("email or password or mobile number is wrong", 400));
  }
  const token = jwt.sign({ email }, process.env.signatureSignIn);
  const userEmail = user.email;
  user = await userModel.findOneAndUpdate(
    { email: userEmail },
    { status: "online" }
  );
  res.status(200).json({ msg: "done", user, token });
});

// @desc    update data of account
// @route   PUT /users/updateAccount
// @roles  "User","Company_HR"
export const updateAccount = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  if (req.body?.password) {
    next(new appError("you can't update password from here", 400));
  }
  if (req.body?.email) {
    const { email } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) {
      next(new appError("your new email already exists", 400));
    }
  }
  if (req.body?.mobileNumber) {
    const { mobileNumber } = req.body;
    const exists = await userModel.findOne({ mobileNumber });
    if (exists) {
      next(new appError("your new mobile Number already exists", 400));
    }
  }
  const user = await userModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(200).json({ msg: "done", user });
});

// @desc    delete account
// @route   DELETE /users/deleteAccount
// @roles  "User","Company_HR"
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await userModel.findOneAndDelete({ _id: id });
  if (!user) {
    next(
      new appError("something wrong went on deletion, try again later", 400)
    );
  }
  const applications = await applicationModel.deleteMany({ userId: id });
  res.status(204).json({ msg: "done", user });
});

export const getUserAccountData = asyncHandler(async (req, res, next) => {
  res.status(200).json({ msg: "done", user: req.user });
});

// @desc    update password (reset password using OTP) after exec forget password
// @route   PUT /users/updatePassword
// @roles  "User","Company_HR"
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { OTP, newPassword } = req.body;
  const { token } = req.params;
  if (!token.startsWith("ebram_")) {
    next(new appError("invalid token", 400));
  }
  const newToken = token.split("ebram_")[1];
  const decoded = jwt.verify(newToken, process.env.signatureResetPassword);
  if (!decoded?.email) {
    next(new appError("something went wrong with reseting password", 400));
  }
  const { email } = decoded;
  const user = await userModel.findOne({ email });
  if (!user) {
    next(new appError("there is no user with this email", 404));
  }
  const compare = bcrypt.compareSync(OTP, user.password);
  if (!compare) {
    next(new appError("OTP is incorrect", 400));
  }
  const hash = bcrypt.hashSync(newPassword, Number(process.env.saltRound));
  await userModel.findOneAndUpdate({ email }, { password: hash });
  res.status(200).json({ msg: "done" });
});

// @desc    send email with link for update password and an OTP
// @route   PUT /users/forgetPassword
// @roles  "User","Company_HR"
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const OTP = customAlphabet("0123456789", 4)
  const hash = bcrypt.hashSync(OTP(), Number(process.env.saltRound));
  const user = await userModel.findOneAndUpdate({ email }, { password: hash });
  if (!user) {
    next(new appError("user dosen't exists", 404));
  }
  const token = jwt.sign({ email }, process.env.signatureResetPassword);
  const link = `http://localhost:8000/users/updatePassword/${token}`;
  const checkEmailSender = await sendEmail(
    email,
    `reset yout password`,
    `<a href='${link}'> reset yout password<br>OTP:${OTP()}</a>`
  );
  if (!checkEmailSender) {
    next(new appError("error in sending email", 400));
  }
  console.log(token);
  res.status(200).json({ msg: "done, check your email" });
});

// @desc    get all accounts that are associated to a specific recovery email
// @route   GET /users/accountsToRecoveryEmail
// @roles  "User","Company_HR"
export const accountsAssociatedToRecoveryEmail = asyncHandler(
  async (req, res, next) => {
    const { recoveryEmail } = req.body;
    const users = await userModel.find({ recoveryEmail });
    if (users.length == 0) {
      next(new appError("there is no users with this recovery email", 404));
    }
    res.status(200).json({ msg: "done", users });
  }
);

// @desc    get a simple data about another profile (username and email only)
// @route   GET /users/userDataForAnotherUser
// @roles  "User","Company_HR"
export const getProfileForAnotherUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  res.status(200).json({
    msg: "done",
    email: user.email,
    username: `${user.firstName} ${user.lastName}`,
  });
});
