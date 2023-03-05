import { useMemo } from "react";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

export const useAddress = (privateKey) => {
  const address = useMemo(() => {
    try {
      return toHex(secp.getPublicKey(privateKey));
    } catch (e) {
      return undefined;
    }
  }, [privateKey]);

  return address;
};

// explain the use of useMemo here
// useMemo is a hook that returns a memoized value. It takes a function and an array of dependencies. The function will only be called if one of the dependencies has changed. This is useful when performing expensive calculations so that you don't have to do them on every render.