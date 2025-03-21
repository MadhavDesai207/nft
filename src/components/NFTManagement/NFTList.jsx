import React, { useEffect, useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import './NFTList.css';

const NFTList = () => {
  const { wallet } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!wallet.isConnected) return;
      
      try {
        setLoading(true);
        // Here you would typically call your contract to get user's NFTs
        // For demo purposes, we'll use placeholder data
        const mockNFTs = [
          { 
            id: 1, 
            name: 'Identity NFT #1', 
            image: 'https://placehold.co/200x200?text=ID+NFT',
            attributes: {
              verified: true,
              dataSharing: ['Email', 'Name'],
              issuedAt: new Date().toLocaleDateString(),
            }
          },
          { 
            id: 2, 
            name: 'Identity NFT #2', 
            image: 'https://placehold.co/200x200?text=ID+NFT',
            attributes: {
              verified: false,
              dataSharing: ['Address'],
              issuedAt: new Date(Date.now() - 86400000).toLocaleDateString(),
            }
          },
        ];
        
        setNfts(mockNFTs);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to load your identity NFTs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [wallet.isConnected]);

  const handleRevokeAccess = (nftId, dataType) => {
    // In a real implementation, this would call a contract function
    setNfts(nfts.map(nft => {
      if (nft.id === nftId) {
        return {
          ...nft,
          attributes: {
            ...nft.attributes,
            dataSharing: nft.attributes.dataSharing.filter(type => type !== dataType)
          }
        };
      }
      return nft;
    }));
  };

  if (loading) return <div className="nft-loading">Loading your identity NFTs...</div>;
  if (error) return <div className="nft-error">{error}</div>;
  if (nfts.length === 0) return <div className="no-nfts">You don't have any identity NFTs yet.</div>;

  return (
    <div className="nft-list-container">
      <h2>Your Identity NFTs</h2>
      <div className="nft-grid">
        {nfts.map(nft => (
          <div key={nft.id} className="nft-card">
            <img src={nft.image} alt={nft.name} className="nft-image" />
            <h3>{nft.name}</h3>
            <div className="nft-details">
              <p className="verification-status">
                Verification Status: 
                <span className={nft.attributes.verified ? "verified" : "unverified"}>
                  {nft.attributes.verified ? "Verified" : "Unverified"}
                </span>
              </p>
              <p>Issued: {nft.attributes.issuedAt}</p>
              
              <div className="data-sharing">
                <h4>Data Sharing Permissions:</h4>
                {nft.attributes.dataSharing.length > 0 ? (
                  <ul>
                    {nft.attributes.dataSharing.map(dataType => (
                      <li key={dataType}>
                        {dataType} 
                        <button 
                          onClick={() => handleRevokeAccess(nft.id, dataType)}
                          className="revoke-button"
                        >
                          Revoke
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No data sharing permissions active</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTList;
