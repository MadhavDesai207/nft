import { ethers } from 'ethers';

// Sign a message to authenticate
export const signMessage = async (signer) => {
  try {
    // Create a unique message with timestamp to prevent replay attacks
    const timestamp = Date.now();
    const message = `Authenticate with Identity NFT Dashboard: ${timestamp}`;
    
    // Sign the message
    const signature = await signer.signMessage(message);
    
    // Return signed data for verification
    return {
      message,
      signature,
      timestamp,
    };
  } catch (error) {
    console.error('Error signing message:', error);
    throw new Error('Authentication failed: ' + (error.message || 'Unknown error'));
  }
};

// Generate JWT (in a real app, this would be done on the server)
// This is a client-side mock for demonstration
export const generateToken = (address, signatureData) => {
  // In a real application, the server would validate the signature and issue a JWT
  // For demo purposes, we're creating a simple object to store in localStorage
  const token = {
    address,
    signedAt: signatureData.timestamp,
    expiresAt: signatureData.timestamp + 3600000, // 1 hour expiry
  };
  
  return btoa(JSON.stringify(token)); // Base64 encode as mock JWT
};

// Check if token is valid
export const isTokenValid = () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return false;
    }
    
    const decoded = JSON.parse(atob(token));
    const now = Date.now();
    
    return decoded.expiresAt > now;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Get user data from token
export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return null;
    }
    
    return JSON.parse(atob(token));
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};