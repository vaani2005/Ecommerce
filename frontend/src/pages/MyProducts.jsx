import { useEffect, useState } from "react";
import api from "../api/axios";
import "./MyProducts.css";

export default function MyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products/my-products");
      setProducts(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="my-products-page">
      <div className="page-header">
        <div>
          <h1>My Products</h1>
          <p>Products created and managed by you</p>
        </div>

        <div className="stats-card">
          <span>Total Products</span>
          <h2>{products.length}</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No Products Found</h3>
          <p>You haven't created any products yet.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-top">
                <h3>{product.name}</h3>

                <span className="category-badge">{product.category}</span>
              </div>

              <p className="description">
                {product.description || "No description available"}
              </p>

              <div className="product-footer">
                <div>
                  <small>Price</small>
                  <h4>₹{product.price}</h4>
                </div>

                <div>
                  <small>Stock</small>
                  <h4>{product.stock}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
