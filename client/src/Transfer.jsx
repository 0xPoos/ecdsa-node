import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import sha256 from 'crypto-js/sha256';
import enc from 'crypto-js/enc-base64'

function Transfer({balance, setBalance, address}) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  function amountChanged(event) {
    setAmount(parseInt(event.target.value));
    setSendAmount(parseInt(event.target.value));
  }

  function recipientChanged(event) {
    setRecipient(event.target.value);
  }

  async function transfer(evt) {
    evt.preventDefault();

    const tx = {
        sender: address,
        amount: amount,
        recipient,
    };
      
    const txHash = sha256(tx);
    console.log("tx hash: ",txHash);

    console.log(txHash.toString(enc.Base64));
      
    const signature = secp.secp256k1.sign(txHash.toString(enc.Base64), address);
    console.log(signature);

    const signatureJSON = JSON.stringify(
      {...signature,
      r: signature.r.toString(),
      s: signature.s.toString(),
      recovery: signature.recovery
      }
    );
    console.log("jsonified", signatureJSON);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        tx: tx,
        recipient,
        signatureJSON
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={amount}
          onChange={amountChanged}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={recipientChanged}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
