import express from "express";
import {excelSheet} from "../controllers/excel.js";
import {excelSheetValidation} from '../validators/application.js';
import { validation } from "../middlewares/validation.js";

const router = express.Router();

router.route("/excel").get(validation(excelSheetValidation),excelSheet)

export default router