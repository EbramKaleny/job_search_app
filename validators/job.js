import joi from "joi";
import { tokenValidation, objectIdValidation } from "./generalValidation.js";

export const addJobValidation = {
    headers: tokenValidation.headers,
    body: joi.object({
        jobTitle: joi.string().required(),
        jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
        workingTime: joi.string().valid("part-time", "full-time"),
        seniorityLevel: joi.string().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
        jobDescription: joi.string().required(),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string())
    })
}

export const updateJobValidation = {
    headers: tokenValidation.headers,
    params: joi.object({
        jobId: joi.string().custom(objectIdValidation).required()
    })
}

export const deleteJobValidation = {
    headers: tokenValidation.headers,
    params: joi.object({
        jobId: joi.string().custom(objectIdValidation).required()
    })
}

export const getAllJobsForSpecificCompanyValidation = {
    query: joi.object({
        companyName: joi.string().required()
    })
}

export const filterJobsValidation = {
    body: joi.object({
        jobTitle: joi.string(),
        workingTime: joi.string().valid("part-time", "full-time"),
        seniorityLevel: joi.string().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
        jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
        technicalSkills: joi.array().items(joi.string().required()),
    }).or("jobTitle","workingTime", "seniorityLevel", "jobLocation", "technicalSkills").required()
}

export const applyToJobValidation = {
    file: joi.object({
        size:joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    }).required(),
    body: joi.object({
        userTechSkills: joi.array().items(joi.string().required()).required(),
        userSoftSkills: joi.array().items(joi.string().required()).required()
    }),
    params: joi.object({
        jobId: joi.string().custom(objectIdValidation).required()
    }),
    headers: tokenValidation.headers
}