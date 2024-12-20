import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./index.css";
import Job from "../../Assets/jobs.json";
import Filter from "../Filter";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// Define experience filters
const experience = [
  { min: 0, max: 1 },
  { min: 2, max: 3 },
  { min: 4, max: 5 },
  { min: 5, max: 10 },
];

const Jobs = () => {
  // Load job data from localStorage and ensure it's not empty
  const JobData = JSON.parse(localStorage.getItem("item")) || [];
  
  // Filter out any jobs with missing essential details (id, company, position, etc.)
  const validJobData = JobData.filter((job) => job && job.id && job.company && job.position);

  const validJobEntries = Job.filter((job) => job && job.id && job.company && job.position);

  const [filteredJobs, setFilteredJobs] = useState([
    ...validJobData,
    ...validJobEntries, // Only include valid jobs from both sources
  ]);
  
  const [searchterm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState(JSON.parse(localStorage.getItem("Jobs")) || []);

  // Function to get logo source
  const getLogoSrc = (logo) => {
    if (!logo) {
      return ""; // Return empty string if logo is missing
    }

    // Check if logo is a base64 string
    if (logo.startsWith("data:image")) {
      return logo; // Return the base64 string directly
    }

    try {
      return require(`../../Assets/images/${logo}`);
    } catch (error) {
      console.error("Logo not found:", error);
      return ""; // Return empty string if logo file is not found
    }
  };

  // Save/Unsave job click handler
  const toggleSaveJob = (id) => {
    const jobExists = savedJobs.some((job) => job.id === id);

    if (jobExists) {
      // If the job is already saved, remove it from savedJobs
      const updatedSavedJobs = savedJobs.filter((job) => job.id !== id);
      setSavedJobs(updatedSavedJobs);
      localStorage.setItem("Jobs", JSON.stringify(updatedSavedJobs));
    } else {
      // If the job is not saved, add it to savedJobs
      const jobToSave = filteredJobs.find((job) => job.id === id);
      const updatedSavedJobs = [...savedJobs, jobToSave];
      setSavedJobs(updatedSavedJobs);
      localStorage.setItem("Jobs", JSON.stringify(updatedSavedJobs));
    }
  };

  // Search functionality
  const searchEvent = (event) => {
    const data = event.target.value;
    setSearchTerm(data);
    if (data.length > 2) {
      const filterData = Job.filter((item) => {
        if (item) {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(data.toLowerCase());
        } else {
          return 0;
        }
      });
      setFilteredJobs(filterData);
    } else {
      setFilteredJobs(Job);
    }
  };

  // Filter by role
  function handleJobFilter(event) {
    const value = event.target.innerText;
    event.preventDefault();
    setFilteredJobs(
      Job.filter((job) => {
        return job.role === value;
      })
    );
  }

  // Filter by experience
  function handleExperienceFilter(checkedState) {
    let filters = [];
    checkedState.forEach((item, index) => {
      if (item === true) {
        const filterS = Job.filter((job) => {
          return (
            job.experience >= experience[index].min &&
            job.experience <= experience[index].max
          );
        });
        filters = [...filters, ...filterS];
      }
      setFilteredJobs(filters);
    });
  }

  return (
    <>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Our Jobs</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {filteredJobs
              .filter((job) => job && job.id && job.company && job.position) // Filter out any invalid jobs
              .map(({ id, logo, company, position, location, posted, role }) => {
                const logoSrc = getLogoSrc(logo); // Use the getLogoSrc function
                const isSaved = savedJobs.some((job) => job.id === id); // Check if job is saved

                return (
                  <div key={id} className="job-list">
                    <div className="job-card">
                      <div className="job-name">
                        {logoSrc ? (
                          <img src={logoSrc} alt="logo" className="job-profile" />
                        ) : (
                          <span>No Logo Available</span>
                        )}
                        <div className="job-detail">
                          <h4>{company}</h4>
                          <h3>{position}</h3>
                          <div className="category">
                            <p>{location}</p>
                            <p>{role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="job-button">
                        <div className="job-posting">
                          <Link to="/apply-jobs">Apply Now</Link>
                        </div>
                        <div className="save-button">
                          <button
                            onClick={() => toggleSaveJob(id)}
                            className={`save-job-btn ${isSaved ? "saved" : ""}`}
                          >
                            {isSaved ? <AiFillHeart /> : <AiOutlineHeart />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <Filter
            setFilteredJobs={setFilteredJobs}
            handleJobFilter={handleJobFilter}
            handleExperienceFilter={handleExperienceFilter}
            searchEvent={searchEvent}
          />
        </div>
      </div>
    </>
  );
};

export default Jobs;
