import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ShopContextProvider from './context/ShopContext.jsx' // Double-check lowercase folder name!
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShopContextProvider> {/* 👈 MUST BE ON THE ABSOLUTE OUTSIDE */}
      <App />
    </ShopContextProvider>
  </React.StrictMode>,
)