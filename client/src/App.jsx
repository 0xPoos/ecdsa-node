import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

import * as secp from 'ethereum-cryptography/secp256k1'

function App() {
  const [balance, setBalance] = useState(0);
  const [signature, setSignature] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />

      <Transfer balance={balance} 
                setBalance={setBalance} 
                address={address}
                />
    </div>
  );
}

export default App;
