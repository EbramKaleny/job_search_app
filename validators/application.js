import joi from 'joi';
import { objectIdValidation } from './generalValidation.js';


export const excelSheetValidation = {
    body: joi.object({
        companyId:joi.string().custom(objectIdValidation).required(),
        date: joi.date().required()
    })
}