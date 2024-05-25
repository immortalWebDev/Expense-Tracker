import React, { useState, useEffect ,useContext} from "react";
import axios from "axios";
import Logout from "./Logout";
import { AuthContext } from "./AuthContext";

function Home() {

  
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    // Fetch user data and pre-fill the form if needed
    const fetchUserData = async () => {
      try {
        const idToken = localStorage.getItem("token");
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
          { idToken: idToken }
        );
        const userData = response.data.users[0];
        console.log(userData);
        if (userData) {
          setName(userData.displayName || "");
          setJob(userData.job || "");
          setLocation(userData.location || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
          job: job,
          location: location,
          returnSecureToken: true,
        }
      );

      console.log("Profile updated successfully:", response.data);

      setName("");
      setJob("");
      setLocation("");
      setDisplayName(name);
      setShowProfileForm(false);
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

  //Verify email
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

      console.log("Email verification link sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending email verification link:", error);
    }
  };

  return (
    <div>
        <Logout></Logout>
      <h1>Welcome to the Expense Eagle{displayName && `, ${displayName}`}!</h1>

      <p>
        You have successfully logged in{" "}
        {<button onClick={handleVerifyEmail}>Verify Email</button>}
      </p>
      {!showProfileForm && (
        <button onClick={() => setShowProfileForm(true)}>
          Complete Profile
        </button>
      )}
      {showProfileForm && (
        <div>
          <h2>Complete Your Profile</h2>
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
            {error && <p>{error}</p>}
            <button
              type="button"
              onClick={handleCreateProfile}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;
