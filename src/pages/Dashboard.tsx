import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BuildingIcon,
  BriefcaseIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  IndianRupeeIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import axios from "axios";

interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
    logo: string;
  };
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  status: string;
  createdAt: string;
}

interface Application {
  _id: string;
  job: Job;
  status: string;
  appliedAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("User:", user);
  useEffect(() => {
    if (user) {
      if (user.role === "jobseeker") {
        fetchApplications();
      } else {
        fetchPostedJobs();
      }
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/applications`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to load applications");
      setLoading(false);
    }
  };

  const fetchPostedJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/posted-jobs`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPostedJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posted jobs:", error);
      setError("Failed to load posted jobs");
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPostedJobs(postedJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === "jobseeker" ? "My Applications" : "Posted Jobs"}
          </h1>
          {user.role === "employer" && (
            <Link
              to="/post-job"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Post New Job
            </Link>
          )}
        </div>

        <div className="space-y-6">
          {user.role === "jobseeker" ? (
            applications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-2 text-gray-500">
                  Start applying for jobs to see them here
                </p>
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.job.title}
                      </h3>
                      <div className="mt-2 flex items-center text-gray-500">
                        <BuildingIcon className="h-5 w-5 mr-2" />
                        <span>{application.job.company.name}</span>
                      </div>
                      <div className="mt-2 flex items-center text-gray-500">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{application.job.location}</span>
                      </div>
                      <div className="mt-2 flex items-center text-gray-500">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span>
                          Applied on{" "}
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : application.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )
          ) : postedJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No jobs posted yet
              </h3>
              <p className="mt-2 text-gray-500">
                Start posting jobs to see them here
              </p>
            </div>
          ) : (
            postedJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <div className="mt-2 flex items-center text-gray-500">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="mt-2 flex items-center text-gray-500">
                      <IndianRupeeIcon className="h-5 w-5 mr-2" />
                      <span>{`${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${
                        job.salary.currency
                      }`}</span>
                    </div>
                    <div className="mt-2 flex items-center text-gray-500">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-200"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <a
                      href={`/jobs/${job._id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition duration-200"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
