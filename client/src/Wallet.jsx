import { useEffect } from "react";
import server from "./server";
import { useAddress } from "./utils";

function Wallet({ balance, setBalance, privateKey }) {
  const address = useAddress(privateKey);

  useEffect(() => {
    server
      .get(`/balance/${address}`)
      .then((response) => {
        setBalance(response.data.balance);
      })
      .catch((_e) => {
        setBalance(0);
      });
  }, [address]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <div className="address">Address: {address.slice(0, 10)}...</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
