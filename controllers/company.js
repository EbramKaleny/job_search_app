import companyModel from "../db/models/company.js";
import jobModel from "../db/models/job.js";
import applicationModel from "../db/models/application.js";
import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";

// @desc    add a new company
// @route   POST /companies/addCompany
// @roles  "Company_HR"
export const addCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmplyees,
    companyEmail,
  } = req.body;
  const { id } = req.user;
  const company = await companyModel.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmplyees,
    companyEmail,
    companyHR: id,
  });
  if (!company) {
    next(
      new appError(
        "something went wrong in adding company, try again later",
        400
      )
    );
  }
  res.status(200).json({ msg: "done", company });
});

// @desc    update company data
// @route   PUT /companies/updateCompany
// @roles  "Company_HR"
export const updateCompany = asyncHandler(async (req, res, next) => {
  if (req.body?.companyName) {
    const { companyName } = req.body;
    const exists = await companyModel.findOne({ companyName });
    if (exists) {
      next(new appError("this company name already exists"));
    }
  }
  if (req.body?.companyEmail) {
    const { companyEmail } = req.body;
    const exists = await companyModel.findOne({ companyEmail });
    if (exists) {
      next(new appError("this company email already exists"));
    }
  }
  const company = await companyModel.findOneAndUpdate(
    { companyHR: req.user.id },
    req.body,
    { new: true }
  );
  if (!company) {
    next(new appError("you are not owner of any company", 404));
  }
  res.status(200).json({ msg: "done" });
});

// @desc    delete company data
// @route   DELETE /companies/deleteCompany
// @roles  "Company_HR"
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const company = await companyModel.findOneAndDelete({ companyHR: id });
  if (!company) {
    next(
      new appError("something wrong went on deletion, try again later", 400)
    );
  }
  const jobs = await jobModel.find({ addedBy: company.companyHR });
  jobs.forEach(async (job) => {
    await applicationModel.deleteMany({ jobId: job._id });
  });
  await jobModel.deleteMany({ addedBy: company.companyHR });
  res.status(204).json({ msg: "done" });
});

// @desc    get company data
// @route   GET /companies/getCompany/:token
// @roles  "Company_HR"
export const getCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const { userId } = req.user;
  const company = await companyModel.findById({ _id: companyId });
  if (!company) {
    next(new appError("there is no company with this id", 404));
  }
  const jobs = await jobModel.find({ addedBy: company.companyHR });
  if (jobs.length == 0) {
    next(new appError("there is no jobs related to this company", 404));
  }
  res.status(200).json({ msg: "done", company, jobs });
});

// @desc    search for a basic data for a company
// @route   GET /companies/searchCompany
// @roles  "User","Company_HR"
export const searchCompany = asyncHandler(async (req, res, next) => {
  const { companyName } = req.body;
  const company = await companyModel.findOne({ companyName });
  if (!company) {
    next(new appError("there is no company with this name", 404));
  }
  res.status(200).json({ msg: "done", company });
});

// @desc    get all applications of users that is submited for a specific job
// @route   GET /companies/getApplicationsOfSpecificJob
// @roles  "Company_HR"
export const getAllApplicationForSpecificJob = asyncHandler(
  async (req, res, next) => {
    const { userId } = req.user;
    const { jobId } = req.body;
    const check = await jobModel.find({ _id: jobId, addedBy: userId });
    if (!check) {
      next(new appError("you don't have access to this job", 400));
    }
    const data = await applicationModel.find({ jobId }).populate([
      {
        path: "userId",
      },
    ]);
    if (!data) {
      next(new appError("there is no applications for this job yet", 404));
    }
    res.status(200).json({ msg: "done", data });
  }
);
