import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function RequireGuest({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/products" replace />;
  }

  return children;
}

function App() {
  const { logout } = useAuth();

  // Listen for token removal (e.g., from API logout or token expiration)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        // Token was removed from localStorage
        logout();
      }
    };

    const handleTokenExpired = () => {
      logout();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, [logout]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />

        <Route
          path="/register"
          element={
            <RequireGuest>
              <Register />
            </RequireGuest>
          }
        />

        <Route
          path="/products"
          element={
            <RequireAuth>
              <Products />
            </RequireAuth>
          }
        />

        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
