const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '673e199081b436001aaa4822',
      'PLAID-SECRET': '9090c575346e10f55ee78093536cbb',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/hello', (req, res) => {
    res.json({ message: 'Hello ' + req.body.name });
});

app.post('/create_link_token', async function (request, response) {
    // Get the client_user_id by searching for the current user
    const PlaidRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'user',
      },
      client_name: 'Plaid Test App',
      products: ['auth'],
      language: 'en',
      redirect_uri: 'http://localhost:3000',
      country_codes: ['US'],
    };
    try {
      const createTokenResponse = await plaidClient.linkTokenCreate(PlaidRequest);
      response.json(createTokenResponse.data);
    } catch (error) {
        response.status(500).send("Failure");
      // handle error
    }
  });

app.post('/auth', async function (request, response) {
    try {
        const access_token = request.body.access_token;
        const plaidRequest = {
            access_token: access_token,
          };
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        response.json(plaidResponse.data);
    } catch (e) {
        response.status(500).send("Failure");
    }
});

app.post('/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = plaidResponse.data.access_token;

    response.json({ accessToken });
  } catch (error) {
    response.status(500).send("Failure");
    // handle error
  }
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});