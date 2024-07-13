import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import exceljs from "exceljs";
import applicationModel from "../db/models/application.js";
import companyModel from "../db/models/company.js";
import jobModel from "../db/models/job.js";
import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";

// @desc    add a new company
// @route   GET /applications/excel
export const excelSheet = asyncHandler(async (req, res, next) => {
  const { companyId, date } = req.body;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filesDirectory = path.join(__dirname, "sheets");
  if (!fs.existsSync(filesDirectory)) {
    fs.mkdirSync(filesDirectory, { recursive: true });
  }
  try {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    const company = await companyModel.findById(companyId);
    const jobs = await jobModel.find({ addedBy: company.companyHR });
    const jobIds = jobs.map((job) => job._id);
    const applications = await applicationModel
      .find({
        jobId: { $in: jobIds },
        createdAt: { $gte: startDate, $lt: endDate },
      })
      .populate("jobId")
      .populate("userId");
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Applications");
    worksheet.columns = [
      { header: "Job Title", key: "jobTitle", width: 30 },
      { header: "Applicant Name", key: "applicantName", width: 30 },
      { header: "Applicant Email", key: "applicantEmail", width: 30 },
      { header: "Technical Skills", key: "technicalSkills", width: 30 },
      { header: "Soft Skills", key: "softSkills", width: 30 },
      { header: "Resume URL", key: "resumeUrl", width: 50 },
    ];
    applications.forEach((app) => {
      worksheet.addRow({
        jobTitle: app.jobId.jobTitle,
        applicantName: `${app.userId.firstName} ${app.userId.lastName}`,
        applicantEmail: app.userId.email,
        technicalSkills: app.userTechSkills.join(", "),
        softSkills: app.userSoftSkills.join(", "),
        resumeUrl: app.userResume,
      });
    });
    const fileName = `applications-${companyId}-${date}.xlsx`;
    const filePath = path.join(filesDirectory, fileName);
    await workbook.xlsx.writeFile(filePath);
    res.status(200).json({ msg: `done, file saved to ${filePath}` });
  } catch (error) {
    next(new appError("Internal Server Error", 500));
  }
});
