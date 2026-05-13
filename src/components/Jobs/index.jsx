import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [dbJobs, setDbJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        const fetchedJobs = response.data;
        setDbJobs(fetchedJobs);

        const validJobEntries = Job.filter(
          (job) => job && job.id && job.company && job.position
        );

        setFilteredJobs([...fetchedJobs, ...validJobEntries]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        const validJobEntries = Job.filter(
          (job) => job && job.id && job.company && job.position
        );
        setFilteredJobs([...validJobEntries]);
      }
    };
    fetchJobs();
  }, []);

  // Fixed unused variable warning
  const [, setSearchTerm] = useState("");

  const [savedJobs, setSavedJobs] = useState(
    JSON.parse(localStorage.getItem("Jobs")) || []
  );

  // Function to get logo source
  const getLogoSrc = (logo) => {
    if (!logo) {
      return "";
    }

    // Base64 image
    if (logo.startsWith("data:image")) {
      return logo;
    }

    try {
      return require(`../../Assets/images/${logo}`);
    } catch (error) {
      console.error("Logo not found:", error);
      return "";
    }
  };

  // Save / Unsave Job
  const toggleSaveJob = (id) => {
    const jobExists = savedJobs.some((job) => job.id === id);

    if (jobExists) {
      const updatedSavedJobs = savedJobs.filter(
        (job) => job.id !== id
      );

      setSavedJobs(updatedSavedJobs);

      localStorage.setItem(
        "Jobs",
        JSON.stringify(updatedSavedJobs)
      );
    } else {
      const jobToSave = filteredJobs.find(
        (job) => job.id === id
      );

      const updatedSavedJobs = [
        ...savedJobs,
        jobToSave,
      ];

      setSavedJobs(updatedSavedJobs);

      localStorage.setItem(
        "Jobs",
        JSON.stringify(updatedSavedJobs)
      );
    }
  };

  // Search functionality
  const searchEvent = (event) => {
    const data = event.target.value;

    setSearchTerm(data);

    if (data.length > 2) {
      const allJobs = [...dbJobs, ...Job];
      const filterData = allJobs.filter((item) => {
        if (item) {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(data.toLowerCase());
        } else {
          return false;
        }
      });

      setFilteredJobs(filterData);
    } else {
      const allJobs = [...dbJobs, ...Job];
      setFilteredJobs(allJobs);
    }
  };

  // Filter by role
  function handleJobFilter(event) {
    const value = event.target.innerText;

    event.preventDefault();

    const allJobs = [...dbJobs, ...Job];
    setFilteredJobs(
      allJobs.filter((job) => {
        return job.role === value;
      })
    );
  }

  // Filter by experience
  function handleExperienceFilter(checkedState) {
    let filters = [];

    checkedState.forEach((item, index) => {
      if (item === true) {
        const allJobs = [...dbJobs, ...Job];
        const filterS = allJobs.filter((job) => {
          return (
            job.experience >= experience[index].min &&
            job.experience <= experience[index].max
          );
        });

        filters = [...filters, ...filterS];
      }
    });

    setFilteredJobs(filters);
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
              .filter(
                (job) =>
                  job &&
                  job.id &&
                  job.company &&
                  job.position
              )
              .map(
                ({
                  id,
                  logo,
                  company,
                  position,
                  location,
                  posted,
                  role,
                }) => {
                  const logoSrc = getLogoSrc(logo);

                  const isSaved = savedJobs.some(
                    (job) => job.id === id
                  );

                  return (
                    <div key={id} className="job-list">
                      <div className="job-card">
                        <div className="job-name">
                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              alt="logo"
                              className="job-profile"
                            />
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
                            <Link to="/apply-jobs">
                              Apply Now
                            </Link>
                          </div>

                          <div className="save-button">
                            <button
                              onClick={() =>
                                toggleSaveJob(id)
                              }
                              className={`save-job-btn ${
                                isSaved ? "saved" : ""
                              }`}
                            >
                              {isSaved ? (
                                <AiFillHeart />
                              ) : (
                                <AiOutlineHeart />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>

          <Filter
            setFilteredJobs={setFilteredJobs}
            handleJobFilter={handleJobFilter}
            handleExperienceFilter={
              handleExperienceFilter
            }
            searchEvent={searchEvent}
          />
        </div>
      </div>
    </>
  );
};

export default Jobs;