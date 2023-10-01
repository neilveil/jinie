import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './home'
import Demo from './demo'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Home>
      <Demo />
    </Home>
  </React.StrictMode>
)
