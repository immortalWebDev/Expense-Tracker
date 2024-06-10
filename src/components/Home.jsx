import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import ViewProfileModal from "./ViewProfileModal";
import EditProfileModal from "./EditProfileModal";
import './Home.css'


function Home() {

  const [showViewProfileModal, setShowViewProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [name, setName] = useState("NA");
  const [job, setJob] = useState("NA");
  const [location, setLocation] = useState("NA");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(null); 

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

         // Check if the token is expired
         if (isTokenExpired(idToken)) {
          idToken = await refreshIdToken();
          if (!idToken) {
            handleLogout();
            return;
          }
        }

        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
          { idToken: idToken }
        );
        const userData = response.data.users[0];
        console.log(userData);
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
          handleLogout();
        } else {
          setError("Error fetching user data. Please try again later.");
        }
        setError("Error fetching user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    console.log("Unfortunately, your session has expired. Please login again!")
    navigate("/signup", { state: { message: "Unfortunately, your session has expired. Please login again!" } });
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    const [, payload] = token.split('.');
    const { exp } = JSON.parse(atob(payload));
    return Date.now() >= exp * 1000;
  };


  const refreshIdToken = async () => {
    try {
      let refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleLogout();
        return null;
      }

      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
        {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }
      );

      const { id_token, refresh_token } = response.data;
      localStorage.setItem("token", id_token);
      localStorage.setItem("refreshToken", refresh_token);
      return id_token;
    } catch (error) {
      console.error("Error refreshing ID token:", error);
      handleLogout();
      return null;
    }
  };

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

      <h1>Welcome to the Expense Eagle, {localStorage.getItem('userName') === 'undefined' ? 'Dear user!' : `${localStorage.getItem('userName')}!`}</h1>
      {logoutMessage && <p>{logoutMessage}</p>}

      
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
  );
}

export default Home;
