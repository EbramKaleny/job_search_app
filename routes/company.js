import express from "express";
import * as CC from "../controllers/company.js";
import * as CV from "../validators/company.js";
import { validation } from "../middlewares/validation.js";
import { auth } from "../middlewares/auth.js";
import { systemRoles } from "../services/systemRoles.js";
import { tokenValidation } from "../validators/generalValidation.js";

const router = express.Router();

router
  .route("/addCompany")
  .post(
    validation(CV.addCompanyValidation),
    auth([systemRoles.HR]),
    CC.addCompany
  );
router
  .route("/updateCompany")
  .put(validation(tokenValidation), auth([systemRoles.HR]), CC.updateCompany);
router
  .route("/deleteCompany")
  .delete(
    validation(tokenValidation),
    auth([systemRoles.HR]),
    CC.deleteCompany
  );
router
  .route("/getCompany/:companyId")
  .get(
    validation(CV.getCompanyValidation),
    auth([systemRoles.HR]),
    CC.getCompany
  );
router
  .route("/searchCompany")
  .get(validation(CV.searchCompanyValidation), auth(), CC.searchCompany);
router
  .route("/getApplicationsOfSpecificJob")
  .get(
    validation(CV.getAllApplicationForSpecificJobValidation),
    auth([systemRoles.HR]),
    CC.getAllApplicationForSpecificJob
  );

export default router;
