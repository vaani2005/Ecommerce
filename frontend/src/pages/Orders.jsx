import { useEffect, useState } from "react";
import "./Orders.css";
import api from "../api/axios";
import OrderCard from "../components/OrderCard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");

      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders");
    }
  };

  return (
    <div className="page-container">
      <div className="page-title">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">All recent orders and their status.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} onChange={fetchOrders} />
          ))
        )}
      </div>
    </div>
  );
}
