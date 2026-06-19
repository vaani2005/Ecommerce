import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Managers.css";

export default function Managers() {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managerProducts, setManagerProducts] = useState([]);
  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const { data } = await api.get("/users/managers");
      setManagers(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteManager = async (id) => {
    try {
      await api.delete(`/users/${id}`);

      setManagers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const viewProducts = async (managerId) => {
    try {
      const { data } = await api.get(`/products/manager/${managerId}`);
      setManagerProducts(data.data);
      setSelectedManager(managerId);
    } catch (err) {
      console.log(err);
    }
  };
  // return (
  //   <div className="managers-page">
  //     <div className="managers-header">
  //       <h2>Managers</h2>
  //       <p>Manage all system managers</p>
  //     </div>

  //     <div className="managers-grid">
  //       {managers.map((manager) => (
  //         <div key={manager._id} className="manager-card">
  //           <div className="avatar">
  //             {manager.name?.charAt(0).toUpperCase()}
  //           </div>

  //           <div className="details">
  //             <h3>{manager.name}</h3>
  //             <p>{manager.email}</p>

  //             <button
  //               onClick={() => deleteManager(manager._id)}
  //               className="deleteBtn"
  //             >
  //               Delete
  //             </button>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
  return (
    <div className="managers-page">
      <div className="managers-header">
        <h2>Managers</h2>
        <p>Manage all system managers</p>
      </div>

      <div className="managers-grid">
        {managers.map((manager) => (
          <div
            key={manager._id}
            className="manager-card"
            onClick={() => viewProducts(manager._id)}
          >
            <div className="avatar">
              {manager.name?.charAt(0).toUpperCase()}
            </div>

            <div className="details">
              <h3>{manager.name}</h3>
              <p>{manager.email}</p>

              <div className="actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // IMPORTANT ⚠️ prevents card click
                    deleteManager(manager._id);
                  }}
                  className="deleteBtn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTS SECTION */}
      {selectedManager && (
        <div className="products-section">
          <h3>Products by Manager</h3>

          {managerProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            managerProducts.map((p) => (
              <div key={p._id} className="product-card">
                <h4>{p.name}</h4>
                <p>₹ {p.price}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
