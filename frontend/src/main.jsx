import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './theme/colors.css';
import './index.css';
import App from './App.jsx';

// Prevent native browser popup alerts; route seamlessly to website-themed alerts
if (typeof window !== 'undefined') {
  window.alert = function (message) {
    window.dispatchEvent(
      new CustomEvent('gem_custom_toast', {
        detail: { message: String(message), type: 'info' },
      })
    );
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
