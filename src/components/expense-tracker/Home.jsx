import React, { useState, useEffect,useCallback,useMemo } from "react";
import axios from "axios";
// import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import ViewProfileModal from "../layout/ViewProfileModal";
import EditProfileModal from "../layout/EditProfileModal";
import { useTheme } from "../misc/ThemeContext";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slice/authSlice";
import './Home.css'
// import { selectTotalAmount } from "../selectors/expensesSelectors";


function Home() {

  const dispatch = useDispatch()

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
  const [loadingEmailVerification, setLoadingEmailVerification] = useState(true);

  // const totalAmount = useSelector(state => state.expenses.totalAmount);

  
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



const getFreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await axios.post(
    `${import.meta.env.VITE_FB_NEW_TOKEN}${import.meta.env.VITE_FB_API}`,
    {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }
  );

  const newIdToken = response.data.id_token;
  const newRefreshToken = response.data.refresh_token;
  const expiresIn = response.data.expires_in;

  localStorage.setItem('token', newIdToken);
  // console.log('Fetched new token from firebase as old token expired in 1 hour')
  localStorage.setItem('refreshToken', newRefreshToken);
  localStorage.setItem('tokenExpiry', Date.now() + expiresIn * 1000);

  return newIdToken;
};

const getToken = async () => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');

  if (token && Date.now() < tokenExpiry) {
    return token;
  } else {
    return await getFreshToken();
  }
};

// Memoize the formatted email
const userEmail = localStorage.getItem('userEmail')
const formattedEmail = useMemo(() => {
  return userEmail.replaceAll('.', '')
}, [userEmail]);

    // Fetch user data and pre-fill the form if needed
    const fetchUserData = useCallback(async () => {
      try {
        // let idToken = localStorage.getItem("token");

        const idToken = await getToken();

        
        const response = await axios.post(
          `${import.meta.env.VITE_FB_PROFILE_LOOKUP}${import.meta.env.VITE_FB_API}`,
          { idToken: idToken }
        );
        const userData = response.data.users[0];
        // console.log('Fetched user profile data from server',userData);
        
        localStorage.setItem('userName',userData.displayName)

        if (userData) {
          setName(userData.displayName || "NA");
          setEmailVerified(userData.emailVerified);

         // Fetch additional user profile details from Realtime Database
         const userId = userData.localId;
        //  const userEmail = localStorage.getItem('userEmail')
        //  const formattedEmail = userEmail.replaceAll('.','')
         const profileResponse = await axios.get(
           `${import.meta.env.VITE_FB_RTDB_BASE_URL}users/${formattedEmail}/${userId}.json`
         );

        //  console.log(profileResponse)
         const userProfile = profileResponse.data;
        //  console.log(userProfile)
        
         if (userProfile) {
           setJob(userProfile.job || "NA");
           setLocation(userProfile.location || "NA");
         }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 400) {
          console.log("Session expired login again")
          dispatch(logout())
        } else {
          setError("Error fetching user data. Please try again later.");
        }
        
      }finally{
        setLoadingEmailVerification(false)
      }
    },[dispatch])

    useEffect(() => {
      fetchUserData();
    },[fetchUserData])
    

  const handleCreateProfile = async () => {
    // Validate the form fields
    if (!name || !job || !location) {
      setError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Post the profile details to Firebase
      // const idToken = localStorage.getItem("token");
      const idToken = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_FB_PROFILE_UPDATE}${import.meta.env.VITE_FB_API}`,
        {
          idToken: idToken,
          displayName: name,
          returnSecureToken: true,
        }
      );


      // Store additional fields in Realtime Database
      const userId = response.data.localId;
      // const userEmail = localStorage.getItem('userEmail')
      // const formattedEmail = userEmail.replaceAll('.','')
      await axios.put(
        `${import.meta.env.VITE_FB_RTDB_BASE_URL}users/${formattedEmail}/${userId}.json`,
        {
          job: job,
          location: location,
        }
      );

      // console.log("Profile updated successfully:", response.data);

       // Update local state with new profile details
    setName(name);
    setJob(job);
    setLocation(location);

    //to view on home
    localStorage.setItem('userName', name);

    
      // setName("");
      // setJob("");
      // setLocation("");
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
  const handleVerifyEmail = useCallback(async (event) => {
    
    event.preventDefault();
    try {
      const idToken = await getToken();

      // const idToken = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_FB_VERIFY_EMAIL}${import.meta.env.VITE_FB_API}`,
        {
          requestType: "VERIFY_EMAIL",
          idToken: idToken,
        }
      );

      setVerificationSent(true)
      
      console.log("Email verification link sent successfully:");
    } catch (error) {
      console.error("Error sending email verification link:", error);
      setVerificationSent(false); 
    }
  },[getToken])

  const addExpenses = () => {
    navigate('/expenses')
  }


  return (
    <>

    <span className="filler-image">
    <img src="https://cdn.jsdelivr.net/gh/immortalWebDev/my-cdn@1e01b30a4644e0e404d8df0590c48a1aa83912ff/expense-tracker/wave-filler.webp" alt="wave" style={{width:"100vh"}} />

   </span>

    <div className="home-container">
      <div className="button-container">      
      </div>
      <div className={`home-text ${theme}`}>
      <h1>Welcome to the <span className="welcome-logo-name">ExpenseEagle</span>, {localStorage.getItem('userName') === 'undefined' || localStorage.getItem('userName') === null ? 'Dear user!' : `${localStorage.getItem('userName')}!`}</h1>
      <p>You have successfully logged in:    <button className="profile-button" onClick={() => setShowViewProfileModal(true)}>
          Your Profile
        </button></p>

      
      {<p>Logged in as: <strong>{localStorage
      .getItem('userEmail')}</strong></p>}
      <p>
          {!emailVerified && <span>Refresh if status is not updated,</span>}{" "}
          {loadingEmailVerification ? (
            <span>Loading...</span>
          ) : emailVerified ? (
            <span>Congrats your Email is <span className="verified-green">verified!</span></span>
          ) : (
            <button className="verify-email-button" onClick={handleVerifyEmail} disabled={verificationSent}>
              {verificationSent ? "Check your inbox" : "Verify Email"}
            </button>
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
    </>
  );
}

export default Home;