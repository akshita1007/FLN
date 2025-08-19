import React, { useState } from 'react';
import '../Styles/Login.css'
import login from '../assets/Images/login.png'
// The main App component that renders the entire login page.
export default function App() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State for UI feedback and loading status
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // A component to display messages to the user.
  const MessageBox = () => {
    // Determine CSS classes based on message type (success, error, info)
    let classes = 'message-box transition-all duration-300 transform ';
    if (message) {
      classes += 'scale-100 opacity-100 ';
    } else {
      classes += 'scale-0 opacity-0 ';
    }

    if (messageType === 'success') {
      classes += 'bg-green-100 text-green-800';
    } else if (messageType === 'error') {
      classes += 'bg-red-100 text-red-800';
    } else {
      classes += 'bg-blue-100 text-blue-800';
    }

    return (
      <div id="messageBox" className={classes}>
        {message}
      </div>
    );
  };

  // Handles the form submission logic.
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Set loading state and display initial message
    setIsLoading(true);
    setMessage('Logging in...');
    setMessageType('info');

    // --- IMPORTANT: REPLACE THIS MOCK API CALL WITH YOUR ACTUAL API ENDPOINT ---
    // This simulates the provided API response.
    const mockApiResponse = {
      "success": true,
      "message": "Login Success",
      "data": {
        "role": "admin",
      },
      "action": "/cacDashboard"
    };

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Handle the mock response
    handleLoginResponse(mockApiResponse);
  };

  // Processes the API response and updates the UI.
  const handleLoginResponse = (response) => {
  setIsLoading(false);

  if (response.success) {
    const { role, token } = response.data;
    const { action } = response;

    // Save token for protected routes
    localStorage.setItem("token", token);

    setMessage(`Login successful! Redirecting to ${role} dashboard.`);
    setMessageType("success");

    // Check for valid role and action
    if (action === "/cacDashboard" && ["admin", "cac", "district", "block", "cluster"].includes(role)) {
      console.log(`User with role '${role}' is being redirected to the dashboard.`);

      // Role-based redirection
      setTimeout(() => {
        if (role === "admin") window.location.href = "/admin";
        else if (role === "cac") window.location.href = "/cac";
        else if (role === "district") window.location.href = "/district";
        else if (role === "block") window.location.href = "/block";
        else if (role === "cluster") window.location.href = "/cluster";
      }, 1000);
    } else {
      setMessage("Invalid role or action received.");
      setMessageType("error");
    }
  } else {
    setMessage(response.message || "Login failed. Please check your credentials.");
    setMessageType("error");
  }
};


  // Return the main component JSX
  return (
    <>
      {/* Custom CSS for animations and enhanced effects */}
     
      <div className="body-bg bg-animated-gradient">
        {/* Main Container for the two-column layout */}
        <div className="login-container">
          {/* Image Section (hidden on small screens) */}
          <div className="image-section">
            <img src={login} height={500} width={500} alt="Secure Login" className="image-styles" />
          </div>
          
          {/* Login Card Container */}
          <div className="login-card">
            <h2 className="card-title">Welcome Back!</h2>
            <p className="card-subtitle">Please enter your credentials to access your account.</p>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="login-form">
              {/* Username Input Field with Icon */}
              <div className="input-group input-glow">
                <div className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Username"
                />
              </div>

              {/* Password Input Field with Icon */}
              <div className="input-group input-glow">
                <div className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a2 2 0 01-2-2V7a2 2 0 114 0v6a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17v2a2 2 0 002 2h2a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Password"
                />
              </div>

              {/* Message Box */}
              <MessageBox />

              {/* Submit Button with Loading State */}
              <div>
                <button
                  type="submit"
                  id="loginButton"
                  disabled={isLoading}
                  className="login-button"
                >
                 {isLoading ? 'Loging In' : 'Login In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
