import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container">
        <main style={{ paddingTop: '60px' }}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
