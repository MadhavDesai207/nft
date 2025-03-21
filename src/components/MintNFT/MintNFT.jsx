import React, { useState } from 'react';
import './MintNFT.css';

const MintNFT = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: '',
    price: '',
    royalties: '10',
    properties: [{ trait_type: '', value: '' }]
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePropertyChange = (index, field, value) => {
    const updatedProperties = [...formData.properties];
    updatedProperties[index] = {
      ...updatedProperties[index],
      [field]: value
    };
    setFormData({
      ...formData,
      properties: updatedProperties
    });
  };

  const addProperty = () => {
    setFormData({
      ...formData,
      properties: [...formData.properties, { trait_type: '', value: '' }]
    });
  };

  const removeProperty = (index) => {
    const updatedProperties = [...formData.properties];
    updatedProperties.splice(index, 1);
    setFormData({
      ...formData,
      properties: updatedProperties
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError('Please upload an image for your NFT');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Mock API call for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form Data:', formData);
      console.log('Image:', image);
      
      setSuccess('NFT has been minted successfully!');
      
      // Reset form after successful submission
      /* 
      setFormData({
        name: '',
        description: '',
        collection: '',
        price: '',
        royalties: '10',
        properties: [{ trait_type: '', value: '' }]
      });
      setImage(null);
      setPreview('');
      */
      
    } catch (err) {
      setError('Failed to mint NFT. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tips for creating NFTs
  const nftTips = [
    { title: 'High Quality Images', text: 'Use high resolution images for better visibility and appeal.' },
    { title: 'Detailed Description', text: 'Add comprehensive details about your NFT to increase its value.' },
    { title: 'Add Properties', text: 'Properties increase rarity and potentially the value of your NFT.' },
    { title: 'Set Fair Price', text: 'Research the market to set a competitive price for your NFT.' }
  ];

  // NFT Stats
  const nftStats = [
    { value: '500+', label: 'NFTs Created', subtext: 'This month' },
    { value: '25 ETH', label: 'Trading Volume', subtext: 'Last 7 days' },
    { value: '10%', label: 'Avg. Royalties', subtext: 'Platform standard' }
  ];

  return (
    <div className="mint-nft-container dashboard-container">
      <h1>Create New NFT</h1>
      
      <div className="dashboard-stats">
        {nftStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-subtext">{stat.subtext}</div>
          </div>
        ))}
      </div>
      
      <div className="mint-section-grid">
        <div className="mint-form-section dashboard-section">
          <h2>NFT Details</h2>
          <form className="mint-form" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className={`image-upload-container ${preview ? 'has-image' : ''}`} onClick={() => document.getElementById('file-input').click()}>
              {preview ? (
                <>
                  <img src={preview} alt="NFT Preview" className="preview-image" />
                  <p className="upload-hint">Click to change image</p>
                </>
              ) : (
                <>
                  <div className="upload-icon">🖼️</div>
                  <p className="upload-text">Upload your NFT image</p>
                  <p className="upload-hint">JPG, PNG, GIF, SVG, WEBP. Max 50MB.</p>
                </>
              )}
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Basic Info */}
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter a name for your NFT"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of your NFT"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="collection">Collection</label>
              <select
                id="collection"
                name="collection"
                value={formData.collection}
                onChange={handleChange}
              >
                <option value="">Select a collection</option>
                <option value="art">Art</option>
                <option value="photography">Photography</option>
                <option value="music">Music</option>
                <option value="gaming">Gaming</option>
                <option value="collectibles">Collectibles</option>
              </select>
            </div>
            
            <div className="form-divider"></div>
            
            {/* Pricing Info */}
            <div className="form-group">
              <label htmlFor="price">Price (ETH) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Set a price for your NFT"
                step="0.001"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="royalties">Royalties (%)</label>
              <input
                type="number"
                id="royalties"
                name="royalties"
                value={formData.royalties}
                onChange={handleChange}
                placeholder="Percentage of secondary sales"
                min="0"
                max="50"
              />
            </div>
            
            <div className="form-divider"></div>
            
            {/* Properties */}
            <div className="properties-section">
              <label>Properties</label>
              <p className="upload-hint">Add traits that appear as attributes on your NFT</p>
              
              <div className="property-list">
                {formData.properties.map((property, index) => (
                  <div key={index} className="property-item">
                    <input
                      type="text"
                      placeholder="Property Name"
                      value={property.trait_type}
                      onChange={(e) => handlePropertyChange(index, 'trait_type', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={property.value}
                      onChange={(e) => handlePropertyChange(index, 'value', e.target.value)}
                    />
                    {formData.properties.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-property-btn"
                        onClick={() => removeProperty(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                type="button" 
                className="add-property-btn"
                onClick={addProperty}
              >
                + Add Property
              </button>
            </div>
            
            {/* Error and Success Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {/* Gas Estimate */}
            <div className="gas-estimate">
              Estimated gas fee: 0.005 ETH
            </div>
            
            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn action-button secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="mint-btn action-button primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <span>Minting...</span>
                  </div>
                ) : 'Mint NFT'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mint-tips-section">
          <div className="dashboard-section">
            <h2>NFT Creation Tips</h2>
            <div className="nft-tips-list">
              {nftTips.map((tip, index) => (
                <div key={index} className="nft-tip-card">
                  <h3>{tip.title}</h3>
                  <p>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="dashboard-section">
            <h2>Recent Mints</h2>
            <div className="recent-mints-list">
              <div className="no-data">
                No recent mints to display
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNFT; 