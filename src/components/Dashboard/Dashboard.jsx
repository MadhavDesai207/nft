import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import './Dashboard.css';

const Dashboard = () => {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalNFTs: 0,
    verifiedNFTs: 0,
  });
  const [connectedDapps, setConnectedDapps] = useState([]);
  const [dataSharingRequests, setDataSharingRequests] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!wallet.isConnected) return;
      
      try {
        setLoading(true);
        
        // Mock data for demonstration
        // In a real app, these would be API or contract calls
        const mockStats = {
          totalNFTs: 2,
          verifiedNFTs: 1,
        };
        
        const mockConnectedDapps = [
          {
            id: 1,
            name: 'Identity Verification Service',
            logo: 'https://placehold.co/100x100?text=ID+APP',
            connectedSince: '2023-05-15',
            dataAccess: ['Name', 'Email', 'Age Verification'],
            status: 'verified'
          },
          {
            id: 2,
            name: 'DeFi Exchange',
            logo: 'https://placehold.co/100x100?text=DeFi',
            connectedSince: '2023-06-02',
            dataAccess: ['KYC Status'],
            status: 'pending'
          }
        ];
        
        const mockDataRequests = [
          {
            id: 101,
            dappName: 'Community DAO',
            logo: 'https://placehold.co/100x100?text=DAO',
            requestedData: ['Email', 'Contribution History'],
            requestDate: new Date().toLocaleDateString(),
            expires: new Date(Date.now() + 86400000 * 3).toLocaleDateString()
          },
          {
            id: 102,
            dappName: 'NFT Marketplace',
            logo: 'https://placehold.co/100x100?text=NFT',
            requestedData: ['Wallet Transaction History'],
            requestDate: new Date(Date.now() - 86400000).toLocaleDateString(),
            expires: new Date(Date.now() + 86400000 * 2).toLocaleDateString()
          }
        ];
        
        // Set state with mock data
        setStats(mockStats);
        setConnectedDapps(mockConnectedDapps);
        setDataSharingRequests(mockDataRequests);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [wallet.isConnected]);

  const handleDisconnectDapp = (dappId) => {
    // In a real app, this would call a contract function or API
    setConnectedDapps(connectedDapps.filter(dapp => dapp.id !== dappId));
  };

  const handleRevokeAccess = (dappId, dataType) => {
    // In a real app, this would call a contract function or API
    setConnectedDapps(connectedDapps.map(dapp => {
      if (dapp.id === dappId) {
        return {
          ...dapp,
          dataAccess: dapp.dataAccess.filter(type => type !== dataType)
        };
      }
      return dapp;
    }));
  };

  const handleRequestAction = (requestId, approved) => {
    // In a real app, this would call a contract function or API
    if (approved) {
      // Simulate approval by moving to connected dapps
      const request = dataSharingRequests.find(req => req.id === requestId);
      
      if (request) {
        const newDapp = {
          id: Date.now(), // Generate a new ID
          name: request.dappName,
          logo: request.logo,
          connectedSince: new Date().toLocaleDateString(),
          dataAccess: request.requestedData,
          status: 'verified'
        };
        
        setConnectedDapps([...connectedDapps, newDapp]);
      }
    }
    
    // Remove the request in both cases
    setDataSharingRequests(dataSharingRequests.filter(req => req.id !== requestId));
  };

  if (loading) return <div className="dashboard-loading">Loading dashboard data...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Identity Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Identity NFTs</h3>
          <p className="stat-value">{stats.totalNFTs}</p>
          <Link to="/nfts" className="stat-link">View All</Link>
        </div>
        
        <div className="stat-card">
          <h3>Verified Identities</h3>
          <p className="stat-value">{stats.verifiedNFTs}</p>
          <div className="verified-badge">Verified</div>
        </div>
        
        <div className="stat-card">
          <h3>Active dApp Connections</h3>
          <p className="stat-value">{connectedDapps.length}</p>
          <p className="stat-subtext">Managing {connectedDapps.reduce((total, dapp) => total + dapp.dataAccess.length, 0)} data points</p>
        </div>
      </div>
      
      {/* Data Sharing Requests */}
      <div className="dashboard-section">
        <h2>Pending Data Sharing Requests</h2>
        {dataSharingRequests.length > 0 ? (
          <div className="data-request-list">
            {dataSharingRequests.map(request => (
              <div key={request.id} className="data-request-card">
                <div className="request-header">
                  <img src={request.logo} alt={request.dappName} className="dapp-logo" />
                  <h3>{request.dappName}</h3>
                </div>
                
                <div className="request-details">
                  <p><strong>Requested Data:</strong></p>
                  <ul>
                    {request.requestedData.map(dataType => (
                      <li key={dataType}>{dataType}</li>
                    ))}
                  </ul>
                  <p><strong>Requested on:</strong> {request.requestDate}</p>
                  <p><strong>Expires:</strong> {request.expires}</p>
                </div>
                
                <div className="request-actions">
                  <button 
                    className="approve-button"
                    onClick={() => handleRequestAction(request.id, true)}
                  >
                    Approve
                  </button>
                  <button 
                    className="reject-button"
                    onClick={() => handleRequestAction(request.id, false)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No pending data sharing requests</p>
        )}
      </div>
      
      {/* Connected dApps */}
      <div className="dashboard-section">
        <h2>Connected dApps</h2>
        {connectedDapps.length > 0 ? (
          <div className="dapp-list">
            {connectedDapps.map(dapp => (
              <div key={dapp.id} className="dapp-card">
                <div className="dapp-header">
                  <img src={dapp.logo} alt={dapp.name} className="dapp-logo" />
                  <div>
                    <h3>{dapp.name}</h3>
                    <span className={`dapp-status ${dapp.status}`}>
                      {dapp.status === 'verified' ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  <button 
                    className="disconnect-button"
                    onClick={() => handleDisconnectDapp(dapp.id)}
                  >
                    Disconnect
                  </button>
                </div>
                
                <div className="dapp-details">
                  <p><strong>Connected Since:</strong> {dapp.connectedSince}</p>
                  <div className="data-access">
                    <p><strong>Data Access:</strong></p>
                    {dapp.dataAccess.length > 0 ? (
                      <ul>
                        {dapp.dataAccess.map(dataType => (
                          <li key={dataType}>
                            {dataType}
                            <button 
                              className="revoke-access-button"
                              onClick={() => handleRevokeAccess(dapp.id, dataType)}
                            >
                              Revoke
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No data access granted</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No connected dApps</p>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="dashboard-actions">
        <Link to="/mint" className="action-button primary">
          Mint New Identity NFT
        </Link>
        <Link to="/nfts" className="action-button secondary">
          Manage Existing NFTs
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;