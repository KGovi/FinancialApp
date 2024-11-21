import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "./components/HomePage";

function App() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && !user?.email_verified) {
      alert("Please verify your email address before logging in.");
      logout({ returnTo: window.location.origin });
    }
  }, [isAuthenticated, user, logout]);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      loginWithRedirect();
    }
  };

  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-left">
            <div className="brand">Moneta</div>
          </div>
          <div className="navbar-right">
            <ul className="nav-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
            </ul>
            <button className="signup-button" onClick={handleButtonClick}>
              {isAuthenticated ? "Logout" : "Sign Up"}
            </button>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" /> : (
                <main className="hero-section">
                  <h1>Your one-stop solution<br />for all financial needs</h1>
                  <p className="hero-description">
                    Take control of your financial life with one powerful app. Track balances, due dates, budgets, subscriptions, and credit scores—all in one place, anytime, anywhere.
                  </p>
                </main>
              )
            }
          />
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
