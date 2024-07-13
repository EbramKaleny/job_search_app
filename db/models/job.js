import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, "job title is required"]
    },
    jobLocation: {
        type: String,
        enum: ["onsite", "remotely", "hybrid"],
        required: [true, "job location is required"]
    },
    workingTime: {
        type: String,
        enum: ["part-time", "full-time"],
        required: [true, "working time is required"]
    },
    seniorityLevel: {
        type: String,
        enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
        required: [true, "seniority level is required"]
    },
    jobDescription: {
        type: String,
        required: [true, "job description is required"]
    },
    technicalSkills: {
        type: [String]
    },
    softSkills: {
        type: [String]
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "added by field is required"]
    }
})

const jobModel = mongoose.model('job', jobSchema)

export default jobModel