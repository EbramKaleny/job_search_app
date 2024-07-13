import joi from "joi";
import { tokenValidation, objectIdValidation } from "./generalValidation.js";

export const addCompanyValidation = {
  body: joi.object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.array().items(joi.string().required()).required(),
    numberOfEmplyees: joi.string().pattern(new RegExp(/^\d+-\d+$/)).custom((value, helpers) => {
      const [start, end] = value.split('-').map(Number)
      if(start>=end){
        return helpers.message("invalid format for range number of employees")
      }
      return value
    }, "range validation"),
    companyEmail: joi.string().email().required(),
  }),
  headers: tokenValidation.headers,
};

export const getCompanyValidation = {
  headers: tokenValidation.headers,
  params: joi.object({
    companyId: joi.string().custom(objectIdValidation).required(),
  }),
};

export const searchCompanyValidation = {
  body: joi.object({
    companyName: joi.string().required(),
  }),
  headers: tokenValidation.headers,
};

export const getAllApplicationForSpecificJobValidation = {
  headers: tokenValidation.headers,
  body: joi.object({
    jobId: joi.string().custom(objectIdValidation).required(),
  }),
};
