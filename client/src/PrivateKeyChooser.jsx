import { useState } from "react";

function PrivateKeyChooser({ onSelectPrivateKey }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [privateKeys] = useState([
    "1dbbbefc4f95cc66b611006307aa5dd7d6be90eb3136ef225a0965b8b9bc84b3",
    "3588f196304800af93b142511cf129b53f6a40a7402474c1d5cc16c8ce5d0ea9",
    "902019743767d4240419379a3c588afcbe3e41a69c77d27f55a2d937ce84a470",
  ]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePrivateKeySelect = (privateKey) => {
    setIsDropdownOpen(false);
    onSelectPrivateKey(privateKey);
  };

  return (
    <div className="private-key-chooser">
      <div className="dropdown" onClick={handleDropdownToggle}>
        or choose a private key from the list
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            {privateKeys.map((key) => (
              <li key={key} onClick={() => handlePrivateKeySelect(key)}>
                {key}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PrivateKeyChooser;
