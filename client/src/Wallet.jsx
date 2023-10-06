import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils"
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import enc from 'crypto-js/enc-base64'


function Wallet({balance, setBalance, address, setAddress }) {
  
  const [privateKey, setPrivateKey] = useState("");

  async function onChange(evt) {
    const key = evt.target.value;
    setPrivateKey(key);
    const publicKeyArray = secp.secp256k1.getPublicKey(key);
    const publicKeyHex = toHex(publicKeyArray).slice(-20);
    setAddress(key);

    if (key) {
      const {
        data: { balance },
      } = await server.get(`balance/${key}`);
      setBalance(balance);

    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>

    </div>
  );
}

export default Wallet;
