import { useState } from "react";

function PrivateKeyChooser({ onSelectPrivateKey }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [privateKeys] = useState([
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
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
        Select a private key
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
