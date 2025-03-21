import React, { createContext, useContext, useEffect, useState } from 'react';
import { connectWallet, disconnectWallet, getBalance } from '../services/web3';

const WalletContext = createContext(null);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState({
    address: '',
    provider: null,
    signer: null,
    chainId: null,
    isConnected: false,
    balance: '0',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is already connected from local storage
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = localStorage.getItem('walletConnected') === 'true';
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (isConnected && savedAddress) {
        try {
          setIsLoading(true);
          // Try to reconnect with provider
          const { provider, signer, address, chainId } = await connectWallet();
          
          // Get ETH balance
          const formattedBalance = await getBalance(provider, address);
          
          setWallet({
            address,
            provider,
            signer,
            chainId,
            isConnected: true,
            balance: formattedBalance,
          });
        } catch (err) {
          console.error('Failed to reconnect wallet:', err);
          setError('Failed to reconnect wallet. Please try connecting again.');
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletAddress');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Connect wallet function
  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { provider, signer, address, chainId } = await connectWallet();
      
      // Get ETH balance
      const formattedBalance = await getBalance(provider, address);
      
      setWallet({
        address,
        provider,
        signer,
        chainId,
        isConnected: true,
        balance: formattedBalance,
      });
      
      // Save connection info
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', address);
      
      return { success: true, address };
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError(err.message || 'Failed to connect wallet');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnect = async () => {
    try {
      await disconnectWallet();
      setWallet({
        address: '',
        provider: null,
        signer: null,
        chainId: null,
        isConnected: false,
        balance: '0',
      });
      
      // Clear connection info
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAddress');
      
      return { success: true };
    } catch (err) {
      console.error('Wallet disconnection failed:', err);
      setError(err.message || 'Failed to disconnect wallet');
      return { success: false, error: err.message };
    }
  };

  // Handle account or chain changes
  useEffect(() => {
    if (wallet.provider && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== wallet.address) {
          // User switched accounts
          window.location.reload();
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      // Subscribe to events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.provider, wallet.address]);

  const value = {
    wallet,
    connect,
    disconnect,
    isLoading,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};