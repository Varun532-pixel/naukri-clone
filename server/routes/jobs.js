import express from "express";
import Job from "../models/Job.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all jobs with filters
router.get("/", async (req, res) => {
  try {
    const { search, location, type, experience } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (location) {
      query.location = new RegExp(location, "i");
    }
    if (type) {
      query.type = type;
    }
    if (experience) {
      query["experience.min"] = { $lte: Number(experience) };
      query["experience.max"] = { $gte: Number(experience) };
    }

    const jobs = await Job.find(query)
      .populate("company", "company.name company.logo")
      .sort("-createdAt");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all jobs with filters
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a new job
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = new Job({
      ...req.body,
      company: req.user.id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Apply for a job
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = job.applications.some(
      (app) => app.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    job.applications.push({
      user: req.user.id,
      status: "pending",
    });

    await job.save();
    res.json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
