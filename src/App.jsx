import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import MintNFT from './components/NFTManagement/MintNFT';
import NFTList from './components/NFTManagement/NFTList';
import { WalletProvider } from './context/WalletContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('walletConnected') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div className="App">
      <Router>
        <WalletProvider>
          <div className="router-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/mint" element={
                <ProtectedRoute>
                  <Layout>
                    <MintNFT />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/nfts" element={
                <ProtectedRoute>
                  <Layout>
                    <NFTList />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </WalletProvider>
      </Router>
    </div>
  );
};

export default App;

