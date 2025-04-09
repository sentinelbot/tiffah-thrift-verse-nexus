
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/animations.css'

// Show a toast when offline
window.addEventListener('offline', () => {
  // We will handle this in the ConnectivityIndicator component
});

// Show a toast when online returns
window.addEventListener('online', () => {
  // We will handle this in the ConnectivityIndicator component
});

// Initialize the app
createRoot(document.getElementById("root")!).render(<App />);
