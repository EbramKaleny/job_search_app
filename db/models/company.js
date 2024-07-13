import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "company name is required"],
    unique: [true, "company name already exists"],
  },
  description: {
    type: String,
    required: [true, "company descriptioon is required"],
  },
  industry: {
    type: String,
    required: [true, "industry is required"],
  },
  address: {
    type: [String],
    required: [true, "address of the company is required"],
  },
  numberOfEmplyees: {
    type: String,
    required: [true, "number of employees is required"]
  },
  companyEmail: {
    type: String,
    required: [true, "company email is required"],
    unique: [true, "email already exists"],
  },
  companyHR: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "hr id of the company is required"],
    unique: [true, "companyHR already exists"]
  },
});

const companyModel = mongoose.model("company", companySchema);

export default companyModel;
