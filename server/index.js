const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  // addresses are the last 20 bytes of the keccak256 hash of the public key:
  "9ad0c7c8b2afbd91467f717cbc0ef1c57e85c4f2": 100, // privKey: 95b8d3f8890b1d51447175e8358c631224ddba5240472f071724f2ef7458318e
  "0fed504fed5b124060daa9e7ec36f2afe3aae02a": 50, // privKey: 0875998487bad7dae4b8edb1ba17b96a0b55fe9f82b03c92fbfc9e14e4df6edba
  "5cf18103207ebd3796dba844c74b41a87993d1c6": 75, // privKey: e533aa0231cc6ccc906a8875975987535f31b364dc2e6687a9a515a1f8da28fb
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { signature, recoveryBit, hashedMessage, recipient, amount } = req.body;
  const publicKey = await secp.recoverPublicKey(hashedMessage, signature, recoveryBit);
  const sender = getAddress(publicKey);

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

function getAddress(publicKey) {
  const slicedPublicKey = publicKey.slice(1);
  const hash = keccak256(slicedPublicKey);
  return hash.slice(-20);
}