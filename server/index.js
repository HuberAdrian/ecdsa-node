const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    const bytes = utf8ToBytes(message)
    const hash = keccak256(bytes)

    return hash
}



async function recoverKey(message, signature, recoveryBit) {
    const hash = hashMessage(message)
    const pubKey = await secp.recoverPublicKey(hash, signature, recoveryBit)

    return pubKey
}

app.use(cors()); // is used to enable Cross-Origin Resource Sharing for the Express application. This means that the server will be able to receive requests from different domains and allow access to the resources accordingly. Without CORS, browsers may block requests to the server, making it difficult for clients to interact with the server's resources.
app.use(express.json()); // is used to parse JSON bodies from requests. This is used to parse the request body sent by the client.

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

// GET /balance/:address
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// POST /send
app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
