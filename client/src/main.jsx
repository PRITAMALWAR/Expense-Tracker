import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#020617',
              color: '#e5e7eb',
              border: '1px solid #1f2937',
              fontSize: '0.85rem',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#020617',
              },
            },
            error: {
              iconTheme: {
                primary: '#f97373',
                secondary: '#020617',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


