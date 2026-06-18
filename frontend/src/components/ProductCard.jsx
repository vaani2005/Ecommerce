import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onOrderSuccess,
}) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const handleOrder = async () => {
    try {
      await api.post("/orders", {
        items: [
          {
            productId: product._id,
            quantity: Number(quantity),
          },
        ],
      });

      alert("Order placed successfully");
      if (onOrderSuccess) {
        onOrderSuccess(product._id, Number(quantity));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Order failed");
    }
  };

  return (
    <article className="product-card">
      <div className="product-card__top">
        <span className="product-card__category">{product.category}</span>
        <span
          className={`product-card__status ${
            product.stock > 0 ? "in-stock" : "out-stock"
          }`}
        >
          {product.stock > 0 ? "In stock" : "Out of stock"}
        </span>
      </div>

      <h3 className="product-card__name">{product.name}</h3>

      <p className="product-card__description">
        {product.description || "No description available."}
      </p>

      <div className="product-card__details">
        <span className="product-card__price">₹{product.price.toFixed(2)}</span>
        <span className="product-card__stock">{product.stock} units</span>
      </div>

      <div className="product-card__footer">
        {user?.role === "customer" && (
          <div className="product-card__order">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="product-card__quantity"
            />
            <button
              className="product-card__btn product-card__btn--order"
              onClick={handleOrder}
              disabled={product.stock < 1}
            >
              Order Now
            </button>
          </div>
        )}

        {(user?.role === "admin" || user?.role === "manager") && (
          <div className="product-card__actions">
            <button
              className="product-card__btn product-card__btn--edit"
              onClick={() => onEdit(product)}
            >
              Edit
            </button>
            {user.role === "admin" && (
              <button
                className="product-card__btn product-card__btn--delete"
                onClick={() => onDelete(product._id)}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
