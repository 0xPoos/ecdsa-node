const express = require("express");
const SHA256 = require("crypto-js/sha256");
const enc = require('crypto-js/enc-base64');
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const port = 3042;
const {toHex} = require('ethereum-cryptography/utils');
const {keccak256} = require("ethereum-cryptography/keccak")

app.use(cors());
app.use(express.json());

const balances = {
  "417d2fa23c4180c6e83849d875af1461b8b2e492da751b4cf14560271d806785": 100,
  "ce2cf28956c8355c0e30573d330c88ce6354ea53ea685920e37f279716855e1a": 50,
  "21921ee211d603fb6ac9da38c33c981fb4f42ee513458f4605243aecb991d5ee": 75,
};

app.get("/balance/:address", (req, res) => {
  console.log("balance reqest = ", req);

  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, tx, recipient, signatureJSON } = req.body;

  console.log(req.body);

  console.log("sender: ",sender);
  console.log("tx: ",tx);
  console.log("recipient: ", recipient);
  console.log("signatureJSON: ",signatureJSON);

  let amount = tx.amount;

  setInitialBalance(tx.sender);
  setInitialBalance(recipient);

  const receivedSignature = JSON.parse(signatureJSON);
  receivedSignature.r = BigInt(receivedSignature.r);
  receivedSignature.s = BigInt(receivedSignature.s);
  receivedSignature.recovery = parseInt(receivedSignature.recovery);

  console.log("receivedSignature", receivedSignature);

  const txHash = SHA256(tx);
  console.log("tx hash: ",txHash);

  const signature = new secp256k1.Signature(receivedSignature.r, receivedSignature.s, receivedSignature.recovery);
  console.log("signature: ", signature);

  const msgHash = txHash.toString(enc.Base64);

  let verified = secp256k1.verify(signature, msgHash, signature.recoverPublicKey(msgHash).toHex()); 

  if (verified) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    console.log("tx verification error!");
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


