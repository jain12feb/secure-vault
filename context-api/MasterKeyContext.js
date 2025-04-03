// context/MasterKeyContext.js
'use client';

import { deriveEncryptionKey } from '@/lib/cryptoUtils';
import { createContext, useContext, useState, useEffect } from 'react';

const MasterKeyContext = createContext(null);

export function MasterKeyProvider({ children }) {
  const [masterKey, setMasterKey] = useState(null);
  
  // Load master key from session storage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = sessionStorage.getItem('masterKey');
      if (storedKey) {
        setMasterKey(storedKey);
      }
    }
  }, []);

  const setMasterPassword = (password, salt = 'your-app-salt') => {
    const derivedKey = deriveEncryptionKey(password, salt);
    const keyString = derivedKey.toString();
    
    // Store in session storage (cleared when browser is closed)
    sessionStorage.setItem('masterKey', keyString);
    setMasterKey(keyString);
    return keyString;
  };

  const clearMasterKey = () => {
    sessionStorage.removeItem('masterKey');
    setMasterKey(null);
  };

  return (
    <MasterKeyContext.Provider value={{ masterKey, setMasterPassword, clearMasterKey }}>
      {children}
    </MasterKeyContext.Provider>
  );
}

export const useMasterKey = () => useContext(MasterKeyContext);
