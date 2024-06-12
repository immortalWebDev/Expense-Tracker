import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import ViewProfileModal from "./ViewProfileModal";
import EditProfileModal from "./EditProfileModal";
import { useTheme } from "../store/ThemeContext";
import './Home.css'


function Home() {

  const {theme} = useTheme()

  const [showViewProfileModal, setShowViewProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [name, setName] = useState("NA");
  const [job, setJob] = useState("NA");
  const [location, setLocation] = useState("NA");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  // const [logoutMessage, setLogoutMessage] = useState(null); 

  const navigate = useNavigate()

useEffect(() => {
  const handleClickOutside = (event) => {
    if (showEditProfileModal || showViewProfileModal) {
      if (!event.target.closest(".modal-content")) {
        setShowEditProfileModal(false);
        setShowViewProfileModal(false);
      }
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showEditProfileModal, showViewProfileModal]);


  useEffect(() => {
    // Fetch user data and pre-fill the form if needed
    const fetchUserData = async () => {
      try {
        let idToken = localStorage.getItem("token");

        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
          { idToken: idToken }
        );
        const userData = response.data.users[0];
        // console.log(userData);
        localStorage.setItem('userName',userData.displayName)

        if (userData) {
          setName(userData.displayName || "");
          setEmailVerified(userData.emailVerified);

         // Fetch additional user profile details from Realtime Database
         const userId = userData.localId;
         const userEmail = localStorage.getItem('userEmail')
         const formattedEmail = userEmail.replaceAll('.','')
         const profileResponse = await axios.get(
           `https://expense-eagle-piyush-default-rtdb.firebaseio.com/users/${formattedEmail}/${userId}.json`
         );
         const userProfile = profileResponse.data;
        
         if (userProfile) {
           setJob(userProfile.job || "");
           setLocation(userProfile.location || "");
         }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 400) {
          console.log("log out")
          // handleLogout();
        } else {
          setError("Error fetching user data. Please try again later.");
        }
        setError("Error fetching user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);


  const handleCreateProfile = async () => {
    // Validate the form fields
    if (!name || !job || !location) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Post the profile details to Firebase
      const idToken = localStorage.getItem("token");
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
        {
          idToken: idToken,
          displayName: name,
          returnSecureToken: true,
        }
      );


      // Store additional fields in Realtime Database
      const userId = response.data.localId;
      const userEmail = localStorage.getItem('userEmail')
      const formattedEmail = userEmail.replaceAll('.','')
      await axios.put(
        `https://expense-eagle-piyush-default-rtdb.firebaseio.com/users/${formattedEmail}/${userId}.json`,
        {
          job: job,
          location: location,
        }
      );

      console.log("Profile updated successfully:", response.data);

      setName("");
      setJob("");
      setLocation("");
      setShowEditProfileModal(false);
      setShowViewProfileModal(false);  
      setError(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        "An error occurred while updating the profile. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email
  const handleVerifyEmail = async (event) => {
    
    event.preventDefault();
    try {
      const idToken = localStorage.getItem("token");
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
        {
          requestType: "VERIFY_EMAIL",
          idToken: idToken,
        }
      );

      setVerificationSent(true)
      
      console.log("Email verification link sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending email verification link:", error);
      setVerificationSent(false); 
    }
  };

  const addExpenses = () => {
    navigate('/expenses')
  }

  return (
    <div>
      <div className="button-container">
        <button className="profile-button" onClick={() => setShowViewProfileModal(true)}>
          Profile
        </button>
        <Logout />
      </div>
      <div className={`home-text ${theme}`}>
      <h1>Welcome to the Expense Eagle, {localStorage.getItem('userName') === 'undefined' ? 'Dear user!' : `${localStorage.getItem('userName')}!`}</h1>
      <p>Refresh page if profile changes are not reflecting on UI</p>

      
      {<p>Logged in as: {localStorage
      .getItem('userEmail')}</p>}
      <p>
        You have successfully logged in, {" "}
        {emailVerified ? (
          <span>and your Email is verified!</span>
        ) : (
          <button className="verify-email-button" onClick={handleVerifyEmail} disabled={verificationSent}>{verificationSent ? "Check your inbox" : "Verify Email"}</button>
        )}
      </p>
      <button className="add-expenses" onClick={() => addExpenses()}>Start adding expenses</button>

      <ViewProfileModal
        show={showViewProfileModal}
        handleClose={() => setShowViewProfileModal(false)}
        profileDetails={{ name, job, location }}
        handleEdit={() => {
          setShowViewProfileModal(false);
          setShowEditProfileModal(true);
        }}
      />

      <EditProfileModal
        show={showEditProfileModal}
        handleClose={() => setShowEditProfileModal(false)}
        name={name}
        setName={setName}
        job={job}
        setJob={setJob}
        location={location}
        setLocation={setLocation}
        handleUpdate={handleCreateProfile}
        isLoading={isLoading}
        error={error}
      />
    </div>
    </div>
  );
}

export default Home;