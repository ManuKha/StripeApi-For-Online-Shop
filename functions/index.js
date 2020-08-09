const functions = require('firebase-functions');

const express = require('express');
var cors = require('cors')
const stripe = require("stripe")("pk_test_trtmanurMylnHzOP2kEq8CZMJ0Fh00UaIbTxYW");
const uuid = require("uuid/v4");
const app = express();

// const PORT = process.env.PORT || 5001


// app.listen(PORT, () => {
//   console.log('works', PORT)
// })

app.listen(3030, '0.0.0.0');

app.use(express.json());

app.use(cors())

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); //change later to only do what i need.
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.get('/api', (req, res, next) => {
    console.log('runingn log')
    res.send('API Status: Running')
});

app.post("/checkout", async (req, res) => {
    console.log('recieved check out');
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { token, amount } = req.body;

    const customer = await stripe.customers.create({
      source: token.id
    });

    const idempotency_key = uuid();
    const charge = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "usd",
        customer: customer.id,
        description: `Purchased the Shirts`
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});

exports.app = functions.https.onRequest(app);