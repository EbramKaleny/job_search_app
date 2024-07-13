import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: [true, "job id is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user id is required"],
    },
    userTechSkills: {
      type: [String],
      required: [true, "user technical skills is required"],
    },
    userSoftSkills: {
      type: [String],
      required: [true, "user soft skills is required"],
    },
    userResume: {
      type: String,
      required: [true, "user resume is required"],
    },
  },
  { timestamps: { createdAt: true } }
);

const applicationModel = mongoose.model("application", applicationSchema);

export default applicationModel;
