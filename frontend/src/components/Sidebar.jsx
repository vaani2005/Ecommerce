import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2>ShopFlow</h2>

      <Link to="/products">Products</Link>

      {user?.role === "admin" && (
        <>
          <Link to="/managers">Managers</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/orders">Orders</Link>
        </>
      )}

      {user?.role === "manager" && (
        <>
          <Link to="/my-products">My Products</Link>
          <Link to="/orders">Orders</Link>
        </>
      )}

      {user?.role === "customer" && (
        <>
          <Link to="/orders">My Orders</Link>
        </>
      )}

      <button onClick={handleLogout}>Logout</button>
    </aside>
  );
}
