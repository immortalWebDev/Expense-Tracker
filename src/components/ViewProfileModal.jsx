// import React from "react";
// import './Modal.css';

// const ViewProfileModal = ({ show, handleClose, profileDetails, handleEdit }) => {
//   if (!show) {
//     return null;
//   }

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-content">
//         <button className="close-button" onClick={handleClose}>
//           &times;
//         </button>
//         <h2>Profile Details</h2>
//         <p>Name: {profileDetails.name}</p>
//         <p>Job: {profileDetails.job}</p>
//         <p>Location: {profileDetails.location}</p>
//         <button onClick={handleEdit}>Edit Profile</button>
//       </div>
//     </div>
//   );
// };

// export default ViewProfileModal;

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
