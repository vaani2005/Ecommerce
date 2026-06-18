import React from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./OrderCard.css";

export default function OrderCard({ order, onChange }) {
  const shortId = order._id ? order._id.slice(-8) : "----";
  const { user } = useAuth();

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/orders/${order._id}/status`, { status: newStatus });

      if (onChange) onChange();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update order status");
    }
  };

  return (
    <article className="order-card">
      <header className="order-card__header">
        <div>
          <div className="order-id">Order #{shortId}</div>
          <div className="order-date">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="order-meta">
          <div className={`order-status ${order.status || "pending"}`}>
            {order.status || "Pending"}
          </div>
          <div className="order-total">
            ₹{order.totalAmount?.toFixed?.(2) ?? order.totalAmount}
          </div>
        </div>
      </header>

      <div className="order-card__body">
        <div className="order-customer">
          <strong>Customer</strong>
          <div>{order.customer?.email || "Guest"}</div>
        </div>

        <div className="order-items">
          <strong>Items</strong>
          <ul>
            {order.items.map((it, idx) => (
              <li key={idx} className="order-item">
                <div className="item-name">{it.product?.name || "Product"}</div>
                <div className="item-meta">
                  x{it.quantity} • ₹{(it.price ?? 0).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="order-card__footer">
        {user && (user.role === "manager" || user.role === "admin") && (
          <>
            <button
              className="btn btn--small"
              onClick={() => updateStatus("accepted")}
            >
              Accept
            </button>
            <button
              className="btn btn--muted"
              onClick={() => {
                if (window.confirm("Reject this order?"))
                  updateStatus("rejected");
              }}
            >
              Reject
            </button>
          </>
        )}

        {user && user.role === "customer" && order.status !== "cancelled" && (
          <button className="btn btn--muted">Cancel</button>
        )}
      </footer>
    </article>
  );
}
