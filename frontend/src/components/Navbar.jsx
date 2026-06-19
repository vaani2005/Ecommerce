import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">ShopFlow</h1>

      <div className="nav-links">
        <Link to="/products">Products</Link>

        {user?.role === "admin" && (
          <>
            <Link to="/managers">Managers</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}

        {user?.role !== "admin" && user && <Link to="/orders">My Orders</Link>}

        {user ? (
          <>
            <span className="nav-user">
              {user.email} ({user.role})
            </span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
