import { useState } from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useAddress } from "./utils";
import { useCallback } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [privateKey, setPrivateKey] = useState("");

  const address = useAddress(privateKey);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    setPrivateKey(event.target.private_key.value);
  }, []);

  return (
    <div className="app">
      {address ? (
        <>
          <Wallet
            balance={balance}
            setBalance={setBalance}
            privateKey={privateKey}
          />
          <Transfer setBalance={setBalance} privateKey={privateKey} />
        </>
      ) : (
        <form className="container transfer" onSubmit={handleSubmit}>
          <input name="private_key" placeholder="Enter your private key" />
          <button className="button" type="submit">
            OK
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
