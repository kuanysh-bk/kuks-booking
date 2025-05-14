import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <main style={{ paddingTop: '60px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
