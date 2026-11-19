import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { CartProvider } from "./context/CartProvider";

/**
 * The application root wires together shared services and state.
 * Providers are placed here so every page can use product queries and the cart.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep fetched data fresh for five minutes before asking the API again.
      staleTime: 1000 * 60 * 5,
      // Keep unused query results in memory for ten minutes.
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* CartProvider makes the same cart available on every route. */}
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
