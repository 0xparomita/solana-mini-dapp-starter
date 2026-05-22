import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    const { solana } = window;
    if (solana && solana.isPhantom) {
      try {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("Connection failed", err);
      }
    } else {
      alert("Please install Phantom Wallet");
    }
  };

  const getBalance = async (address) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Error fetching balance", err);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      getBalance(walletAddress);
    }
  }, [walletAddress]);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', textAlign: 'center' }}>
      <h1>Solana Devnet Explorer</h1>
      {!walletAddress ? (
        <button onClick={connectWallet} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected: <strong>{walletAddress}</strong></p>
          <p>Balance: <strong>{balance} SOL</strong></p>
          <button onClick={() => getBalance(walletAddress)} style={{ marginTop: '10px' }}>
            Refresh Balance
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
