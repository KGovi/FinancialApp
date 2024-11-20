// PlaidLinkButton.js
import React, { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidLinkButton = () => {
  const [linkToken, setLinkToken] = useState(null);

  // Step 1: Request a link token from the backend
  const createLinkToken = async () => {
    const response = await fetch('/api/create-link-token');
    const data = await response.json();
    setLinkToken(data.link_token);
  };

  // Step 2: Use the link token to initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log('Plaid Link Success:', public_token, metadata);
      
      // Step 3: Exchange the public token for an access token via your backend
      fetch('/api/exchange-public-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      }).then(response => response.json())
        .then(data => {
          console.log('Received access token:', data);
        });
    },
  });

  return (
    <div>
      <button onClick={createLinkToken} disabled={linkToken}>
        Generate Link Token
      </button>

      {linkToken && (
        <button onClick={() => open()} disabled={!ready}>
          Open Plaid Link
        </button>
      )}
    </div>
  );
};

export default PlaidLinkButton;
