// import logo from './logo.svg';
// import './App.css';
import axios from 'axios';
import { useEffect, useState } from "react";
import { usePlaidLink } from 'react-plaid-link';
import './HomePage.css';

axios.defaults.baseURL = 'http://localhost:8000';

function PlaidAuth({publicToken}) {
  const [account, setAccount] = useState();

  useEffect(() => {
    async function fetchData() {
      let accessToken = await axios.post('/exchange_public_token', { public_token: publicToken });
      console.log(accessToken.data);
      const auth = await axios.post('/auth', { access_token: accessToken.data.accessToken });
      console.log(auth.data);
      setAccount(auth.data);
    }
    fetchData();
  }, []);
  return account && (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Available Balance</th>
            <th>Current Balance</th>
            <th>Account Number</th>
            <th>Routing Number</th>
          </tr>
        </thead>
        <tbody>
          {account.accounts.map((acc, index) => (
            <tr key={index}>
              <td>{acc.name}</td>
              <td>{acc.balances.available}</td>
              <td>{acc.balances.current}</td>
              <td>{account.numbers.ach[index].account}</td>
              <td>{account.numbers.ach[index].routing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {

  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();

  useEffect(() => {
    async function fetch() {
      const response = await axios.post('/create_link_token');
      setLinkToken(response.data.link_token);
    }
    fetch();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
      console.log("Success", public_token, metadata);
      // send public_token to server
    },
  });
  
  return publicToken ? (<PlaidAuth publicToken={publicToken} />) : (
    <button className="connect-button" onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}

export default App;
