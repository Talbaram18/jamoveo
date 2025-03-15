import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import * as io from 'socket.io-client';

// Create socket connection
const socket = io.connect('http://localhost:5000');
(window as any).socket = socket;

// Get the root element
const rootElement = document.getElementById('root');

if (rootElement) {
  // Create a root using createRoot
  const root = createRoot(rootElement);

  // Render the app
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
