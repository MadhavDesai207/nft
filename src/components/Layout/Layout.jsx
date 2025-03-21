import React from 'react';
import Header from './Header';
import './Layout.css';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {/* <Header /> */}
      <div className="layout-content">
        {/* <Sidebar /> */}
        <main className="main-content">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;