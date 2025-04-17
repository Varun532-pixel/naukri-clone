import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    name: String,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: "INR",
    },
  },
  experience: {
    min: Number,
    max: Number,
  },
  skills: [String],
  applications: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "reviewed", "accepted", "rejected"],
        default: "pending",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
  status: {
    type: String,
    enum: ["active", "closed", "draft"],
    default: "active",
  },
});

jobSchema.index({ title: "text", description: "text", skills: "text" });

const Job = mongoose.model("Job", jobSchema);

export default Job;
