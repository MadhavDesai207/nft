import { ethers } from 'ethers';

// Function to connect to wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet detected. Please install MetaMask or another wallet.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from wallet');
    }
    
    const address = accounts[0];
    
    // Create provider and signer - updated for ethers.js v6
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Get current chain ID
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    return { provider, signer, address, chainId };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw new Error(error.message || 'Failed to connect to wallet');
  }
};

// Function to disconnect wallet (for UI purposes - can't actually disconnect MetaMask)
export const disconnectWallet = async () => {
  // Nothing to do here for MetaMask, we just update our app state
  return true;
};

// Function to get contract instance
export const getContract = (contractAddress, contractABI, signer) => {
  try {
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    console.error('Error getting contract instance:', error);
    throw new Error('Failed to get contract instance');
  }
};

// Function to check if the connected wallet is on the correct network
export const checkNetwork = async (provider, requiredChainId) => {
  const network = await provider.getNetwork();
  return Number(network.chainId) === requiredChainId;
};

// Function to switch networks
export const switchNetwork = async (requiredChainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${requiredChainId.toString(16)}` }],
    });
    return true;
  } catch (error) {
    console.error('Error switching network:', error);
    throw new Error('Failed to switch network');
  }
};

// Get ETH balance for an address
export const getBalance = async (provider, address) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Failed to get balance');
  }
};

// Sign a message (useful for verification)
export const signMessage = async (signer, message) => {
  try {
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw new Error('Failed to sign message');
  }
};

// Execute a contract write function with transaction
export const executeContractWrite = async (contract, methodName, args = [], options = {}) => {
  try {
    const tx = await contract[methodName](...args, options);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error(`Error executing contract method ${methodName}:`, error);
    throw new Error(`Failed to execute contract method: ${error.message}`);
  }
};