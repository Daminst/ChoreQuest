import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { SettingsProvider } from './hooks/useSettings';
import App from './App';
import './index.css';

function AppProviders() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  { path: '*', element: <AppProviders /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Register service worker with auto-update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');

      // If a new SW is already waiting (e.g. installed while tab was idle)
      if (reg.waiting) {
        window.dispatchEvent(new CustomEvent('sw:update-available', { detail: reg }));
      }

      // Detect newly installed SW entering the waiting state
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent('sw:update-available', { detail: reg }));
          }
        });
      });

      // Check for updates every 30 minutes and on tab re-focus (debounced)
      let lastCheck = Date.now();
      const check = () => {
        const now = Date.now();
        if (now - lastCheck < 5 * 60_000) return; // at most once per 5 min
        lastCheck = now;
        reg.update().catch(() => {});
      };
      setInterval(check, 30 * 60_000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    } catch { /* SW registration failed — non-critical */ }
  });

  // When a new SW takes control, reload to get fresh assets
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
