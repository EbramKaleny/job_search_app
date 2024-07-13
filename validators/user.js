import joi from "joi";
import { systemRoles } from "../services/systemRoles.js";
import { tokenValidation } from "./generalValidation.js";

export const signUpValidation = {
  body: joi.object({
    firstName: joi.string().min(3).max(32).required(),
    lastName: joi.string().min(3).max(32).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
      .required(),
    recoveryEmail: joi.string().email().required(),
    DOB: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
    mobileNumber: joi
      .array()
      .items(
        joi
          .string()
          .pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/))
          .required()
      )
      .unique()
      .required(),
    role: joi.string().valid(systemRoles.user, systemRoles.HR),
  }),
};

export const signInValidation = {
  body: joi
    .object({
      email: joi.string().email(),
      mobileNumber: joi
        .array()
        .items(joi.string().pattern(/^01[0-2,5]{1}[0-9]{8}$/))
        .unique(),
      recoveryEmail: joi.string().email(),
      password: joi
        .string()
        .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
        .required(),
    })
    .xor("email", "mobileNumber", "recoveryEmail"),
};

export const updateAccountValidation = {
  body: joi.object({
    email: joi.string().email(),
    mobileNumber: joi
      .array()
      .items(joi.string().pattern(/^[0-9]{11}$/))
      .unique(),
  }),
  headers: tokenValidation.headers,
};

export const updatePasswordValidation = {
  body: joi.object({
    OTP: joi.string().required(),
    newPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
      .required(),
  }),
  params: joi.object({
    token: joi.string().required(),
  }),
};

export const forgetPasswordValidation = {
  body: joi.object({
    email: joi.string().email().required(),
  }),
};

export const accountsAssociatedToRecoveryEmailValidation = {
  body: joi.object({
    recoveryEmail: joi.string().email().required(),
  }),
  headers: tokenValidation.headers,
};

export const getProfileForAnotherUserValidation = {
  body: joi.object({
    email: joi.string().email().required(),
  }),
  headers: tokenValidation.headers,
};
