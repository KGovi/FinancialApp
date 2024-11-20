import React from "react";
import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">Moneta</div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <h1>Your one-stop solution<br />for all financial needs</h1>
        <div className="button-group">
          {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
        </div>
      </main>
    </div>
  );
}

export default App;
