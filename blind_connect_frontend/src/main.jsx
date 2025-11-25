// main.jsx or index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// REPLACE THIS WITH YOUR ACTUAL CLIENT ID FROM GOOGLE CONSOLE
const GOOGLE_CLIENT_ID = "1055327279448-jfet3d41q36jmoem2hg9f0g1gt9rorqg.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)