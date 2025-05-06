
import React from 'react'; // Explicit React import
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/glassy-theme.css';

// Get the container element
const container = document.getElementById('root');

// Ensure container exists
if (!container) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML");
}

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
