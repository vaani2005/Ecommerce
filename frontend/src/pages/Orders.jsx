import { useEffect, useState } from "react";
import "./Orders.css";
import api from "../api/axios";
import OrderCard from "../components/OrderCard";
import { getErrorDetails } from "../utils/errorHandler";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/orders", {
        params: {
          page,
          pageSize,
        },
      });

      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(getErrorDetails(err).message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="page-container">
      <div className="page-title">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">All recent orders and their status.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="orders-header">
        <div>
          <p>Total orders: {total}</p>
          <p>Newest orders first</p>
        </div>
        <div className="pagination-controls">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(current + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <OrderCard key={order._id} order={order} onChange={fetchOrders} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
