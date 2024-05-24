import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDxRZQnGCbIbLdX0T-hMudwZE9GiRmWIIw`,
        {
          idToken: idToken,
          displayName: name,
          photoUrl: null, 
          returnSecureToken: true,
        }
      );

      console.log("Profile updated successfully:", response.data);
      
      
      setName("");
      setJob("");
      setLocation("");
      setShowProfileForm(false);
      setError(null);
    } catch (error) {
      console.error("Error updating profile:", error);

      console.log("Error response:", error.response.data);

      
      setError("An error occurred while creating the profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome to the Expense Eagle!</h1>
      <p>You have successfully logged in.</p>
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
            {error && <p className="error-message">{error}</p>}
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
