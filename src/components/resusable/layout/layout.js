import React from 'react';
import './layout.css';
import Header from './header';

function Layout({ children }) {
  return (
    <div className="layout-container">
      <div className="header">
        <Header />
      </div>
      <div className="children-container">{children}</div>
    </div>
  );
}

export default Layout;
