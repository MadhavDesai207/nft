import React from 'react';
import './WalletConnect.css';

function WalletConnect({ onConnect, isLoading }) {
  return (
    <div className="wallet-connect-container">
      <button 
        className="connect-button" 
        onClick={onConnect} 
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading-spinner"></span>
        ) : (
          <>
            <img 
              src="/metamask-logo.svg" 
              alt="MetaMask" 
              className="wallet-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            Connect Wallet
          </>
        )}
      </button>
      <div className="supported-wallets">
        <p>Supported wallets:</p>
        <div className="wallet-logos">
          <span>MetaMask</span>
          <span>WalletConnect</span>
        </div>
      </div>
    </div>
  );
}

export default WalletConnect;