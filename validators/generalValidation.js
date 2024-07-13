import joi from "joi";
import mongoose from "mongoose";

export const tokenValidation = {
  headers: joi.object({
    "cache-control": joi.string(),
    "postman-token": joi.string(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
    token: joi.string().required(),
  }),
};

export const objectIdValidation = (value, helper) => {
  return mongoose.Types.ObjectId.isValid(value) ? true : helper.message("invalid id")
}