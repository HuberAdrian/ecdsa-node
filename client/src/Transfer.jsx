import * as secp from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ privateKey, setBalance }) {
  async function handleSubmit(event) {
    event.preventDefault();

    const message = {
      address, sendAmount, recipient,
    };

    const hash = hashMessage(JSON.stringify(message));
    const [sig, recoveryBit] = await secp.sign(hash, privateKey, {recovered: true});
    message.sign = toHex(sig);
    message.recoveryBit = recoveryBit;
    setSignature(toHex(sig));
    setRecoveryBit(recoveryBit);
    console.log('request:', message);

    try {
      const data = {
        amount: parseInt(event.target.amount.value),
        recipient: event.target.recipient.value,
      };
      const hash = sha256(utf8ToBytes(`${data.recipient}${data.amount}`));
      const [signature, recovery] = await secp.sign(hash, privateKey, {
        recovered: true,
      });
      const {
        data: { balance },
      } = await server.post(`send`, {
        ...data,
        signature: toHex(signature),
        recovery,
      });
      setBalance(balance);
    } catch (e) {
      if (e?.response?.data?.message) {
        alert(e.response.data.message);
      } else {
        console.error(e);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={handleSubmit}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input name="amount" placeholder="1, 2, 3..."></input>
      </label>

      <label>
        Recipient
        <input
          name="recipient"
          placeholder="Type an address, for example: 0x2"
        ></input>
      </label>

      <button type="submit" className="button">
        Submit
      </button>
    </form>
  );
}

export default Transfer;