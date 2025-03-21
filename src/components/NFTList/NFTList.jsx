import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NFTList.css';

// Mock data for NFTs
const mockNFTs = [
  {
    id: 1,
    name: 'Digital Abstract #247',
    creator: 'ArtistOne',
    image: 'https://placekitten.com/400/400',
    price: 0.45,
    collection: 'Digital Abstracts',
    listed: true,
    tokenId: '2475',
    blockchain: 'Ethereum'
  },
  {
    id: 2,
    name: 'Cosmic Journey #18',
    creator: 'CryptoVisionary',
    image: 'https://placekitten.com/401/401',
    price: 0.87,
    collection: 'Cosmic Journeys',
    listed: true,
    tokenId: '1896',
    blockchain: 'Ethereum'
  },
  {
    id: 3,
    name: 'Pixel Punk #451',
    creator: 'PixelMaster',
    image: 'https://placekitten.com/402/402',
    price: 1.2,
    collection: 'Pixel Punks',
    listed: false,
    tokenId: '4519',
    blockchain: 'Ethereum'
  },
  {
    id: 4,
    name: 'Nature Harmony #33',
    creator: 'EcoArtist',
    image: 'https://placekitten.com/403/403',
    price: 0.25,
    collection: 'Nature Harmonies',
    listed: true,
    tokenId: '3387',
    blockchain: 'Ethereum'
  },
  {
    id: 5,
    name: 'Urban Legend #77',
    creator: 'StreetCanvas',
    image: 'https://placekitten.com/404/404',
    price: 0.95,
    collection: 'Urban Legends',
    listed: true,
    tokenId: '7732',
    blockchain: 'Ethereum'
  },
  {
    id: 6,
    name: 'Futuristic Dreams #129',
    creator: 'FutureVision',
    image: 'https://placekitten.com/405/405',
    price: 0.65,
    collection: 'Futuristic Dreams',
    listed: false,
    tokenId: '1295',
    blockchain: 'Ethereum'
  }
];

const NFTList = () => {
  const [nfts, setNfts] = useState(mockNFTs);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const itemsPerPage = 6;

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setNfts(mockNFTs);
      return;
    }
    
    const filtered = mockNFTs.filter(nft => 
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setNfts(filtered);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFilterBy(filter);
    
    if (filter === 'all') {
      setNfts(mockNFTs);
    } else if (filter === 'listed') {
      setNfts(mockNFTs.filter(nft => nft.listed));
    } else if (filter === 'unlisted') {
      setNfts(mockNFTs.filter(nft => !nft.listed));
    }
    
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    
    let sortedNfts = [...nfts];
    
    if (sort === 'price-low') {
      sortedNfts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      sortedNfts.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      sortedNfts.sort((a, b) => b.id - a.id);
    } else if (sort === 'oldest') {
      sortedNfts.sort((a, b) => a.id - b.id);
    }
    
    setNfts(sortedNfts);
  };

  // Pagination
  const totalPages = Math.ceil(nfts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = nfts.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // NFT Stats
  const nftStats = [
    { value: '24', label: 'Total NFTs', subtext: 'In your collection' },
    { value: '4', label: 'Listed NFTs', subtext: 'Currently on sale' },
    { value: '2.5 ETH', label: 'Total Value', subtext: 'Estimated' }
  ];

  // NFT Card Component
  const NFTCard = ({ nft, viewMode }) => (
    <div className={`nft-card ${viewMode === 'grid' ? 'nft-card-grid' : 'nft-card-list'}`}>
      <div className="nft-image-container">
        <img src={nft.image} alt={nft.name} className="nft-image" />
        {nft.listed && (
          <div className="listing-badge">For Sale</div>
        )}
      </div>
      
      <div className="nft-details">
        <h3 className="nft-title">{nft.name}</h3>
        <p className="nft-creator">By {nft.creator}</p>
        
        <div className="nft-price">
          <span className="nft-price-icon">Ξ</span>
          {nft.price.toFixed(2)} ETH
        </div>
        
        {viewMode === 'list' && (
          <div className="nft-metadata">
            <span>Collection: {nft.collection}</span>
            <span>Token ID: {nft.tokenId}</span>
          </div>
        )}
        
        <div className="nft-actions">
          <Link to={`/nft/${nft.id}`} className="nft-button view-details-button">
            View
          </Link>
          {nft.listed && (
            <button className="nft-button buy-now-button">
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="nft-list-container dashboard-container">
      <h1>My NFT Collection</h1>
      
      <div className="dashboard-stats">
        {nftStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-subtext">{stat.subtext}</div>
          </div>
        ))}
      </div>
      
      <div className="dashboard-section">
        <h2>NFT Gallery</h2>
        
        <div className="nft-controls">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, creator, or collection"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          
          <div className="filter-bar">
            <select 
              className="filter-select"
              value={filterBy}
              onChange={handleFilterChange}
            >
              <option value="all">All NFTs</option>
              <option value="listed">Listed</option>
              <option value="unlisted">Unlisted</option>
            </select>
            
            <select 
              className="filter-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            
            <div className="view-toggle">
              <button 
                className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`} 
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`} 
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="dashboard-loading">Loading NFTs...</div>
        ) : nfts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-text">No NFTs found.</p>
            <Link to="/mint" className="create-nft-button action-button primary">Create New NFT</Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'nft-grid' : 'nft-list'}>
            {currentItems.map(nft => (
              <NFTCard key={nft.id} nft={nft} viewMode={viewMode} />
            ))}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      
      <div className="dashboard-actions">
        <Link to="/mint" className="action-button primary">
          Create New NFT
        </Link>
        <button className="action-button secondary">
          Import NFTs
        </button>
      </div>
    </div>
  );
};

export default NFTList; 