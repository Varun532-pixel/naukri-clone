import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Find Your Dream Job</span>
            <span className="block text-blue-600">Start Your Journey Today</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Search through thousands of job listings and find the perfect match for your skills and experience.
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-10 max-w-3xl mx-auto">
          <form className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Popular Job Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Technology', count: '1.2k Jobs' },
            { title: 'Marketing', count: '850 Jobs' },
            { title: 'Design', count: '650 Jobs' },
          ].map((category, index) => (
            <Link
              key={index}
              to="/jobs"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200"
            >
              <div className="flex items-center">
                <BriefcaseIcon className="h-10 w-10 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-gray-500">{category.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Create Account',
                description: 'Sign up and complete your profile to start your job search journey.',
              },
              {
                title: 'Search Jobs',
                description: 'Browse through our extensive list of job opportunities.',
              },
              {
                title: 'Apply & Get Hired',
                description: 'Apply to your desired positions and land your dream job.',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;