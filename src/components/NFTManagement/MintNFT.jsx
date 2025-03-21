import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../context/WalletContext';
import './MintNFT.css';

function MintNFT() {
  const { wallet } = useWallet();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    birthdate: '',
    customFields: []
  });
  const [customField, setCustomField] = useState({ key: '', value: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState(null);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCustomFieldChange = (e) => {
    const { name, value } = e.target;
    setCustomField({ ...customField, [name]: value });
  };

  const addCustomField = () => {
    if (customField.key && customField.value) {
      setFormData({
        ...formData,
        customFields: [...formData.customFields, { ...customField }]
      });
      setCustomField({ key: '', value: '' });
    }
  };

  const removeCustomField = (index) => {
    const updatedFields = [...formData.customFields];
    updatedFields.splice(index, 1);
    setFormData({ ...formData, customFields: updatedFields });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const mintNFT = async () => {
    setIsLoading(true);
    try {
      // Mock contract interaction
      // In a real application, this would interact with the actual contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create IPFS metadata (mock for now)
      const metadata = {
        name: formData.name,
        description: "Identity NFT",
        attributes: [
          { trait_type: "Email", value: formData.email },
          { trait_type: "Country", value: formData.country },
          { trait_type: "Birthdate", value: formData.birthdate },
          ...formData.customFields.map(field => ({
            trait_type: field.key,
            value: field.value
          }))
        ]
      };
      
      console.log("Minting NFT with metadata:", metadata);
      
      // Simulate successful mint
      setMintStatus({
        success: true,
        message: "Identity NFT minted successfully!",
        txHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      });
      
      // Reset form after successful mint
      setFormData({
        name: '',
        email: '',
        country: '',
        birthdate: '',
        customFields: []
      });
      setStep(1);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMintStatus({
        success: false,
        message: error.message || "Failed to mint NFT. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="birthdate">Birthdate</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="next-button" onClick={nextStep}>
                Next
              </button>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h2>Additional Information</h2>
            <div className="custom-fields-section">
              <h3>Custom Fields</h3>
              <p className="helper-text">Add any additional information you want to include in your identity NFT.</p>
              
              <div className="custom-fields-list">
                {formData.customFields.map((field, index) => (
                  <div key={index} className="custom-field-item">
                    <div className="field-content">
                      <strong>{field.key}:</strong> {field.value}
                    </div>
                    <button 
                      type="button" 
                      className="remove-field-button"
                      onClick={() => removeCustomField(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="custom-field-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="key"
                      value={customField.key}
                      onChange={handleCustomFieldChange}
                      placeholder="Field name (e.g. Occupation)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      name="value"
                      value={customField.value}
                      onChange={handleCustomFieldChange}
                      placeholder="Value (e.g. Engineer)"
                    />
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="add-field-button"
                  onClick={addCustomField}
                  disabled={!customField.key || !customField.value}
                >
                  Add Field
                </button>
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button type="button" className="next-button" onClick={nextStep}>
                Review
              </button>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h2>Review Information</h2>
            <div className="review-section">
              <div className="review-item">
                <div className="review-label">Name:</div>
                <div className="review-value">{formData.name}</div>
              </div>
              
              <div className="review-item">
                <div className="review-label">Email:</div>
                <div className="review-value">{formData.email}</div>
              </div>
              
              <div className="review-item">
                <div className="review-label">Country:</div>
                <div className="review-value">{formData.country}</div>
              </div>
              
              <div className="review-item">
                <div className="review-label">Birthdate:</div>
                <div className="review-value">{formData.birthdate}</div>
              </div>
              
              {formData.customFields.length > 0 && (
                <div className="review-custom-fields">
                  <h3>Custom Fields:</h3>
                  {formData.customFields.map((field, index) => (
                    <div key={index} className="review-item">
                      <div className="review-label">{field.key}:</div>
                      <div className="review-value">{field.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="gas-estimate">
              <div className="gas-label">Estimated Gas Fee:</div>
              <div className="gas-value">~0.005 ETH</div>
            </div>
            
            <div className="disclaimer">
              <p>By minting this NFT, you confirm that all provided information is accurate and belongs to you. This information will be stored on the blockchain and may be accessible to dApps you authorize.</p>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button 
                type="button" 
                className="mint-button" 
                onClick={mintNFT}
                disabled={isLoading}
              >
                {isLoading ? 'Minting...' : 'Mint Identity NFT'}
              </button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="mint-nft-container">
      <h1>Mint Identity NFT</h1>
      
      
      
      <div className="mint-form">
        {mintStatus ? (
          <div className={`mint-status ${mintStatus.success ? 'success' : 'error'}`}>
            <div className="status-icon">
              {mintStatus.success ? '✅' : '❌'}
            </div>
            <h2>{mintStatus.success ? 'Success!' : 'Error'}</h2>
            <p>{mintStatus.message}</p>
            {mintStatus.success && mintStatus.txHash && (
              <div className="tx-details">
                <p>Transaction Hash:</p>
                <a 
                  href={`https://etherscan.io/tx/${mintStatus.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  {mintStatus.txHash.substring(0, 10)}...{mintStatus.txHash.substring(mintStatus.txHash.length - 8)}
                </a>
              </div>
            )}
            <button 
              className="new-mint-button"
              onClick={() => setMintStatus(null)}
            >
              Mint Another NFT
            </button>
          </div>
        ) : (
          renderFormStep()
        )}
      </div>
    </div>
  );
}

export default MintNFT;