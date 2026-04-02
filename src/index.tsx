
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("index.tsx: Root rendering started");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <SubscriptionProvider>
    <App />
  </SubscriptionProvider>
);
console.log("index.tsx: Root rendering complete");
