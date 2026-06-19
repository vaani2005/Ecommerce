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
import Managers from "./pages/Managers";
import Customers from "./pages/Customers";
import Sidebar from "./components/Sidebar";
import MyProducts from "./pages/MyProducts";
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
function RequireManager({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "manager") {
    return <Navigate to="/products" replace />;
  }

  return children;
}
function RequireAdmin({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/products" replace />;
  }

  return children;
}
function Layout() {
  const location = useLocation();

  const hideSidebar = ["/", "/register"].includes(location.pathname);

  return (
    <div className="app-layout">
      {!hideSidebar && <Sidebar />}

      <div className={hideSidebar ? "" : "main-content"}>
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
            path="/managers"
            element={
              <RequireAdmin>
                <Managers />
              </RequireAdmin>
            }
          />

          <Route
            path="/customers"
            element={
              <RequireAdmin>
                <Customers />
              </RequireAdmin>
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
            path="/my-products"
            element={
              <RequireManager>
                <MyProducts />
              </RequireManager>
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

          <Route
            path="/managers"
            element={
              <RequireAuth>
                <Managers />
              </RequireAuth>
            }
          />

          <Route
            path="/customers"
            element={
              <RequireAuth>
                <Customers />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
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
      <Layout />
    </BrowserRouter>
  );
}

export default App;
