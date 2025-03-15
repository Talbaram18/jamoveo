import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {currentYear} JaMoveo </p>
      </div>
    </footer>
  );
};
