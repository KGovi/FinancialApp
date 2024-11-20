import React, { useEffect } from "react";
import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated, user, logout } = useAuth0();

  useEffect(() => {
    // Check if the user is authenticated but their email is not verified
    if (isAuthenticated && user && !user.email_verified) {
      alert("Please verify your email address before proceeding.");
      logout({ returnTo: window.location.origin }); // Log them out and redirect to login page
    }
  }, [isAuthenticated, user, logout]);

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">Moneta</div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <h1>
          Your one-stop solution
          <br />
          for all financial needs
        </h1>
        <div className="button-group">
          {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
        </div>
      </main>
    </div>
  );
}

export default App;
