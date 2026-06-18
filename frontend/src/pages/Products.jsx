import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { getFieldError, hasFieldError } from "../utils/errorHandler";
import "./Products.css";

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    order,
    page,
    pageSize,
  ]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category,
        inStock,
        sortBy,
        order,
        page,
        pageSize,
      };

      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await api.get("/products", { params });
      setProducts(data.products);
      setTotal(data.total);
      setCategoryCounts(data.categoryCounts || []);
    } catch (err) {
      const formattedError = err.formattedError || {
        message: "Unable to load products",
        fieldErrors: {},
      };
      setGeneralError(formattedError.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
    });
    setFieldErrors({});
    setFormError("");
  };

  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({
        ...fieldErrors,
        [field]: undefined,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      const formattedError = err.formattedError || {
        message: "Unable to save product",
        fieldErrors: {},
      };

      if (Object.keys(formattedError.fieldErrors).length > 0) {
        setFieldErrors(formattedError.fieldErrors);
      } else {
        setFormError(formattedError.message);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setFieldErrors({});
    setFormError("");
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }
    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
    } catch (err) {
      const formattedError = err.formattedError || {
        message: "Unable to delete product",
        fieldErrors: {},
      };
      setGeneralError(formattedError.message);
    }
  };

  const categories = ["", ...categoryCounts.map((item) => item._id)];

  return (
    <div className="page-container">
      <div className="page-title">
        <div>
          <h1>Product Catalog</h1>
          <p className="page-subtitle">
            Browse inventory, filter by category, price, and stock availability.
          </p>
        </div>
      </div>

      <div className="products-layout">
        <aside className="filters-card">
          <h2>Search & filters</h2>
          <div className="filters">
            <div className="search-wrap">
              <input
                className="filter-input"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="actions">
                <button
                  type="button"
                  className="btn btn--search"
                  onClick={() => setPage(1)}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn--clear"
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setMinPrice("");
                    setMaxPrice("");
                    setInStock("");
                    setSortBy("createdAt");
                    setOrder("desc");
                    setPage(1);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <label>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.filter(Boolean).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Min price
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
            </label>

            <label>
              Max price
              <input
                type="number"
                placeholder="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </label>

            <label>
              Availability
              <select
                value={inStock}
                onChange={(e) => setInStock(e.target.value)}
              >
                <option value="">All stock</option>
                <option value="true">In stock</option>
              </select>
            </label>
          </div>

          <div className="category-list">
            <h3>Top categories</h3>
            {categoryCounts.length === 0 ? (
              <p>No category data available.</p>
            ) : (
              <div className="category-tags">
                {categoryCounts.map((item) => (
                  <button
                    key={item._id}
                    className="category-tag"
                    onClick={() => setCategory(item._id)}
                  >
                    {item._id} ({item.count})
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="products-main">
          {generalError && <p className="error-text">{generalError}</p>}

          {user?.role !== "customer" && user && (
            <div className="product-form-card">
              <h2>{editingProduct ? "Edit Product" : "Create Product"}</h2>
              {formError && <p className="error-text">{formError}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className={
                      hasFieldError(fieldErrors, "name") ? "input-error" : ""
                    }
                  />
                  {getFieldError(fieldErrors, "name") && (
                    <span className="field-error">
                      {getFieldError(fieldErrors, "name")}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className={
                      hasFieldError(fieldErrors, "category")
                        ? "input-error"
                        : ""
                    }
                  />
                  {getFieldError(fieldErrors, "category") && (
                    <span className="field-error">
                      {getFieldError(fieldErrors, "category")}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    className={
                      hasFieldError(fieldErrors, "price") ? "input-error" : ""
                    }
                    min="0"
                    step="0.01"
                  />
                  {getFieldError(fieldErrors, "price") && (
                    <span className="field-error">
                      {getFieldError(fieldErrors, "price")}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => handleFormChange("stock", e.target.value)}
                    className={
                      hasFieldError(fieldErrors, "stock") ? "input-error" : ""
                    }
                    min="0"
                  />
                  {getFieldError(fieldErrors, "stock") && (
                    <span className="field-error">
                      {getFieldError(fieldErrors, "stock")}
                    </span>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit">
                    {editingProduct ? "Save" : "Create"}
                  </button>
                  {editingProduct && (
                    <button type="button" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className="product-summary">
            <p>Total products: {total}</p>
            <p>Page: {page}</p>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onOrderSuccess={(productId, quantity) => {
                    setProducts((current) =>
                      current.map((item) =>
                        item._id === productId
                          ? { ...item, stock: item.stock - quantity }
                          : item,
                      ),
                    );
                  }}
                />
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>
            <span>{page}</span>
            <button
              disabled={page * pageSize >= total}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </main>
      </div>
    </div>
  );
}
