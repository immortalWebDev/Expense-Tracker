// import React from "react";
// import './Modal.css';

// const EditProfileModal = ({ show, handleClose, name, setName, job, setJob, location, setLocation, handleUpdate, isLoading, error }) => {
//   if (!show) {
//     return null;
//   }

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-content">
//         <button className="close-button" onClick={handleClose}>
//           &times;
//         </button>
//         <h2>Edit Profile</h2>
//         <form>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <label htmlFor="job">Job:</label>
//           <input
//             type="text"
//             id="job"
//             value={job}
//             onChange={(e) => setJob(e.target.value)}
//           />
//           <label htmlFor="location">Location:</label>
//           <input
//             type="text"
//             id="location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//           {error && <p>{error}</p>}
//           <button
//             type="button"
//             onClick={handleUpdate}
//             disabled={isLoading}
//           >
//             {isLoading ? "Updating..." : "Update"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfileModal;







// import React, { useEffect, useRef } from 'react';

// const EditProfileModal = ({
//   show,
//   handleClose,
//   name,
//   setName,
//   job,
//   setJob,
//   location,
//   setLocation,
//   handleUpdate,
//   isLoading,
//   error
// }) => {
//   const modalRef = useRef();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         handleClose();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [handleClose]);

//   if (!show) {
//     return null;
//   }

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content" ref={modalRef}>
//         <h2>Edit Profile</h2>
//         <form>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <label htmlFor="job">Job:</label>
//           <input
//             type="text"
//             id="job"
//             value={job}
//             onChange={(e) => setJob(e.target.value)}
//           />
//           <label htmlFor="location">Location:</label>
//           <input
//             type="text"
//             id="location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//           {error && <p>{error}</p>}
//           <button
//             type="button"
//             onClick={handleUpdate}
//             disabled={isLoading}
//           >
//             {isLoading ? "Updating..." : "Update"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfileModal;




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
