import jobModel from "../db/models/job.js";
import applicationModel from "../db/models/application.js";
import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import companyModel from "../db/models/company.js";

// @desc    add a new job
// @route   POST /jobs/addJob
// @roles  "Company_HR"
export const addJob = asyncHandler(async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const { id } = req.user;
  const job = await jobModel.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: id,
  });
  if (!job) {
    next(new appError("something went wrong, try again", 400));
  }
  res.status(200).json({ msg: "done", job });
});

// @desc    update data of a job
// @route   PUT /jobs/updateJob/:jobId
// @roles  "Company_HR"
export const updateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { _id } = req.user;
  const job = await jobModel.findOneAndUpdate(
    { _id: jobId, addedBy: _id },
    req.body,
    {
      new: true,
    }
  );
  if (!job) {
    next(new appError("there is no job with this id in your jobs", 404));
  }
  res.status(200).json({ msg: "done" });
});

// @desc    delete existing job
// @route   DELETE /jobs/deleteJob/:jobId
// @roles  "Company_HR"
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { _id } = req.user;
  const job = await jobModel.findOneAndDelete({ _id: jobId, addedBy: _id });
  if (!job) {
    next(new appError("there is no job with this id in your jobs", 404));
  }
  await applicationModel.deleteMany({ jobId });
  res.status(204).json({ msg: "done" });
});

// @desc    get all jobs and their companies
// @route   GET /jobs/getJobsAndCompanies
// @roles  "User","Company_HR"
export const getAllJobsAndCompanies = asyncHandler(async (req, res, next) => {
  const data = await jobModel.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHR",
        as: "company",
      },
    },
    {
      $unwind: "$company",
    },
    {
      $project: {
        _id: 1,
        jobTitle: 1,
        jobLocation: 1,
        workingTime: 1,
        seniorityLevel: 1,
        jobDescription: 1,
        technicalSkills: 1,
        softSkills: 1,
        addedBy: 1,
        company: {
          companyName: 1,
          description: 1,
          industry: 1,
          address: 1,
          numberOfEmplyees: 1,
          companyEmail: 1,
        },
      },
    },
  ]);
  if (data.length == 0) {
    next(new appError("couldn't found jobs and companies", 404));
  }
  res.status(200).json({ msg: "done", data });
});

// @desc    get all jobs for specific company
// @route   GET /jobs/getJobsForCompany
// @roles  "User","Company_HR"
export const getAllJobsForSpecificCompany = asyncHandler(
  async (req, res, next) => {
    const { companyName } = req.query;
    const company = await companyModel.findOne({ companyName });
    const jobs = await jobModel.find({ addedBy: company.companyHR });
    res.status(200).json({ msg: "done", jobs });
  }
);

// @desc    filtaration type of jobs
// @route   GET /jobs/filterJobs
// @roles  "User","Company_HR"
export const filterJobs = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    next(new appError("select atleast one or more filters", 400));
  }
  const jobs = await jobModel.find(req.body);
  if (jobs.length == 0) {
    next(new appError("there is no jobs", 404));
  }
  res.status(200).json({ msg: "done", jobs });
});

// @desc    apply for a job and add application for this job
// @route   GET /jobs/apply/:jobId
// @roles  "User"
export const applyToJob = asyncHandler(async (req, res, next) => {
  const { userTechSkills, userSoftSkills } = req.body;
  const { jobId } = req.params;
  const { _id } = req.user;
  if (!req.file) {
    next(new appError("resume is required", 400));
  }
  const application = await applicationModel.create({
    jobId,
    userId: _id,
    userTechSkills,
    userSoftSkills,
    userResume: req.file.path,
  });
  if (!application) {
    next(new appError("something went wrong, try again"));
  }
  res.status(200).json({ msg: "done" });
});
