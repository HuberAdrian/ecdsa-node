const express = require("express");
const { sha256 } = require("ethereum-cryptography/sha256");
const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const cors = require("cors");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0450a4c70e1fd14906837cc07468445dfd600092d46671224fded125e3aaab21ffbd25c28dd0fc990e00cfd723dc91635980b11fb831eddc3ae992772c30658015": 100, // privKey: 1dbbbefc4f95cc66b611006307aa5dd7d6be90eb3136ef225a0965b8b9bc84b3
  "04f49de4f08f332c7b424d070347e5b467e6e390d800444ddba0eec93b49edf643669fffe50b2144895e3620c52427c74740fa0b34127b7e6d509caa24a07918b9": 50, // privKey: 3588f196304800af93b142511cf129b53f6a40a7402474c1d5cc16c8ce5d0ea9
  "04d1b787ecd20fd25cc3a0de86b835e37beabc35a4684ceb2402cc4d4f98a5d94a1244d9e0601e7ee47463090b18b790f3a766f979b401c421c55f836ec22434d3": 75, // privKey: 902019743767d4240419379a3c588afcbe3e41a69c77d27f55a2d937ce84a470
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recovery, recipient, amount } = req.body;

  const hash = sha256(utf8ToBytes(`${recipient}${amount}`));
  const sender = toHex(secp.recoverPublicKey(hash, signature, recovery));

  if (!balances[sender]) {
    res.status(400).send({ message: "Something went wrong!" });
    return;
  }

  if (!balances[recipient]) {
    res.status(400).send({ message: "Invalid recipient address!" });
    return;
  }

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
