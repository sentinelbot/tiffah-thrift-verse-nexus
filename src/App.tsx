
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeOfflineService } from "./services/offlineService";
import { useEffect } from "react";
import { ConnectivityIndicator } from "./components/ui/connectivity-indicator";
import { ThemeProvider } from "./components/ui/theme-provider";

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
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Outlet />
          <Toaster position="top-right" richColors closeButton />
          <ConnectivityIndicator />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
