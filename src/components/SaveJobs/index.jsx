import React from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// Preload all images from the Assets/images folder
const images = require.context("../../Assets/images", false, /\.(png|jpe?g|svg)$/);

const SaveJobs = () => {
  // Getting the saved jobs from localStorage
  const savedJobs = JSON.parse(localStorage.getItem("Jobs")) || [];

  // Helper function to get the logo path
  const getLogoSrc = (logo) => {
    try {
      return images(`./${logo}`);
    } catch (error) {
      return null; // Return null if logo is not found
    }
  };

  // Toggle Save Job Functionality (Remove job from saved list)
  const toggleSaveJob = (id) => {
    const updatedSavedJobs = savedJobs.filter((job) => job.id !== id);
    localStorage.setItem("Jobs", JSON.stringify(updatedSavedJobs));
    window.location.reload(); // Refresh to update the saved jobs view
  };

  return (
    <div>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Saved Jobs</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {savedJobs.length > 0 ? (
              savedJobs.map(({ id, logo, company, position, location, role }) => {
                const logoSrc = getLogoSrc(logo);
                const isSaved = true; // All jobs here are saved

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
              })
            ) : (
              <p>No saved jobs available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveJobs;
