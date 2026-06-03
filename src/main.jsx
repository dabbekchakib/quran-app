import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const hideSplash = () => {
  const el = document.getElementById('splash');
  if (el) el.classList.add('hidden');
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

requestAnimationFrame(hideSplash);
