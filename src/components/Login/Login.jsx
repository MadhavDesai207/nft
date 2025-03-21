import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { signMessage, generateToken } from '../../services/authService';
import WalletConnect from './WalletConnect';
import './Login.css';

function Login() {
  const { wallet, connect, isLoading, error } = useWallet();
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Redirect if already connected
  useEffect(() => {
    if (wallet.isConnected) {
      navigate('/');
    }
  }, [wallet.isConnected, navigate]);

  const handleConnect = async () => {
    try {
      const result = await connect();
      
      if (result.success) {
        try {
          // Sign message for authentication
          const signatureData = await signMessage(wallet.signer);
          
          // Generate and store token
          const token = generateToken(wallet.address, signatureData);
          localStorage.setItem('authToken', token);
          
          // Redirect to dashboard
          navigate('/');
        } catch (err) {
          setAuthError(err.message || 'Authentication failed');
        }
      }
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Identity NFT Dashboard</h1>
        <p>Connect your wallet to manage your identity NFTs</p>
        
        <WalletConnect 
          onConnect={handleConnect} 
          isLoading={isLoading} 
        />
        
        {(error || authError) && (
          <div className="error-message">
            {error || authError}
          </div>
        )}
        
        <div className="login-info">
          <h3>What you can do:</h3>
          <ul>
            <li>Mint and manage your identity NFTs</li>
            <li>View connected dApps and verification status</li>
            <li>Approve or reject data sharing requests</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;