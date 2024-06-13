import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const ViewProfileModal = ({
  show,
  handleClose,
  profileDetails,
  handleEdit,
}) => {
  if (!show) {
    return null;
  }

  const { name, job, location } = profileDetails;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>View Profile</h2>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Job:</strong> {job}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
        <div className="edit-button">
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ViewProfileModal;
