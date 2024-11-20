// LoginButton.js
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user && !user.email_verified) {
      alert('Please verify your email address!');
    }
  }, [isAuthenticated, user]);

  return (
    !isAuthenticated ? (
      <button className="login-button" onClick={() => loginWithRedirect()}>Log In</button>
    ) : (
      <p>Welcome, {user.name}!</p>
    )
  );
};

export default LoginButton;
