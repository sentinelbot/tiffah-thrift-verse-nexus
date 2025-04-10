
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeOfflineService } from "./services/offlineService";
import { useEffect } from "react";
import { ConnectivityIndicator } from "./components/ui/connectivity-indicator";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize offline service when app loads
    initializeOfflineService();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
      <ConnectivityIndicator />
    </QueryClientProvider>
  );
}

export default App;
