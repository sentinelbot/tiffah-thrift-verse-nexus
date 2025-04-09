
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/animations.css'
import { toast } from 'sonner';

// Measure initial page load performance
if (typeof window !== 'undefined' && window.performance) {
  // Add Performance Observer for Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Create an observer for CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.hadRecentInput) return;
          console.log('CLS:', entry);
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Create an observer for LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('LCP:', entry.startTime / 1000, 'seconds');
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Create an observer for FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime, 'ms');
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('Performance Observer error:', e);
    }
  }
}

// Show a toast when offline
window.addEventListener('offline', () => {
  toast.warning('You are offline. Some features may be limited.', {
    duration: 5000,
    icon: '📶',
  });
});

// Show a toast when online returns
window.addEventListener('online', () => {
  toast.success('You are back online!', {
    duration: 3000,
    icon: '📶',
  });
});

// Initialize the app
createRoot(document.getElementById("root")!).render(<App />);
