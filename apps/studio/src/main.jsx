import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './theme/app.css';

// Load FrogUI Web Components so we can use them in React
import '@frogui/ui-core';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
