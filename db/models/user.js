import mongoose from "mongoose";
import { systemRoles } from "../../services/systemRoles.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "your first name is required"],
    minlength: [3, "first name should be more than 2 characters"],
    maxlength: [32, "first name should be less than 32 characters"],
  },
  lastName: {
    type: String,
    required: [true, "your last name is required"],
    minlength: [3, "last name should be more than 2 characters"],
    maxlength: [32, "last name should be less than 32 characters"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already exists"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  recoveryEmail: {
    type: String,
    required: [true, "recovery email is required"],
    lowercase: true,
  },
  DOB: {
    type: Date,
    required: [true, "your birth date is required"],
  },
  mobileNumber: {
    type: [String],
    required: [true, "at least one mobile number is required"],
    unique: [true, "mobile number already exists"],
  },
  role: {
    type: String,
    enum: Object.values(systemRoles),
    default: "User",
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
