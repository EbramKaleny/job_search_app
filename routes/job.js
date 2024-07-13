import express from "express";
import * as JC from "../controllers/job.js";
import * as JV from '../validators/job.js';
import { multerLocal, validExtension} from "../services/multer.js";
import { systemRoles } from "../services/systemRoles.js";
import { auth } from "../middlewares/auth.js";
import {validation} from '../middlewares/validation.js';

const router = express.Router();

router.route("/getJobsAndCompanies").get(auth(),JC.getAllJobsAndCompanies)
router.route("/getJobsForCompany").get(validation(JV.getAllJobsForSpecificCompanyValidation),auth(),JC.getAllJobsForSpecificCompany)
router.route("/filterJobs").get(validation(JV.filterJobsValidation),auth(),JC.filterJobs)
router.route("/apply/:jobId").post(multerLocal(validExtension.pdf).single("resume"),validation(JV.applyToJobValidation),auth([systemRoles.user]),JC.applyToJob)
router.route("/addJob").post(validation(JV.addJobValidation),auth([systemRoles.HR]),JC.addJob)
router.route("/updateJob/:jobId").put(validation(JV.updateJobValidation),auth([systemRoles.HR]),JC.updateJob)
router.route("/deleteJob/:jobId").delete(validation(JV.deleteJobValidation),auth([systemRoles.HR]),JC.deleteJob)

export default router