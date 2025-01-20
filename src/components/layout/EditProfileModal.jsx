import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const EditProfileModal = ({
  show,
  handleClose,
  name,
  setName,
  job,
  setJob,
  location,
  setLocation,
  handleUpdate,
  isLoading,
  error
}) => {
  if (!show) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Edit Profile</h2>
        <form>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="job">Job:</label>
          <input
            type="text"
            id="job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="button" onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default EditProfileModal;
