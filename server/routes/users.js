import express from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's job applications
router.get('/applications', auth, async (req, res) => {
  try {
    const jobs = await Job.find({
      'applications.user': req.user._id
    }).populate('company', 'company.name company.logo');

    const applications = jobs.map(job => {
      const application = job.applications.find(
        app => app.user.toString() === req.user._id.toString()
      );
      return {
        _id: application._id,
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary,
        },
        status: application.status,
        appliedAt: application.appliedAt,
      };
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get employer's posted jobs
router.get('/posted-jobs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const jobs = await Job.find({ company: req.user._id })
      .sort('-createdAt');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;