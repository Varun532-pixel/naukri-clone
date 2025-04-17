import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BuildingIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  IndianRupeeIcon,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    description: string;
  };
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experience: {
    min: number;
    max: number;
  };
  skills: string[];
  createdAt: string;
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/${id}`
      );
      setJob(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("Failed to load job details");
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs/${id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Job not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <div className="mt-2 flex items-center text-gray-500">
                  <BuildingIcon className="h-5 w-5 mr-2" />
                  <span>{job.company?.name || "Unknown"}</span>
                </div>
                <div className="mt-2 flex items-center text-gray-500">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{job.location}</span>
                </div>
              </div>
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-500">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <IndianRupeeIcon className="h-5 w-5 mr-2" />
                <span>{`${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${
                  job.salary.currency
                }`}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {job.description}
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Requirements</h2>
              <ul className="list-disc list-inside text-gray-600">
                {job.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Experience</h2>
              <p className="text-gray-600">
                {job.experience.min} - {job.experience.max} years
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                About the Company
              </h2>
              <p className="text-gray-600">
                {job.company?.description || "Not available !"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
