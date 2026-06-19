import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get("/users/customers");
      setCustomers(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setCustomers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const viewOrders = async (customerId) => {
    try {
      console.log("Customer:", customerId);

      const response = await api.get(`/orders/customer/${customerId}`);

      console.log("Response:", response.data);

      setCustomerOrders(response.data.data);
      setSelectedCustomer(customerId);
    } catch (err) {
      console.log("ERROR:", err.response?.status);
      console.log("DATA:", err.response?.data);
    }
  };
  // return (
  //   <div className="customers-page">
  //     <div className="customers-header">
  //       <h2>Customers</h2>
  //       <p>All registered customers in system</p>
  //     </div>

  //     <div className="customers-grid">
  //       {customers.map((customer) => (
  //         <div key={customer._id} className="customer-card">
  //           <div className="avatarr">
  //             {customer.name?.charAt(0).toUpperCase()}
  //           </div>

  //           <div className="details">
  //             <h3>{customer.name}</h3>
  //             <p>{customer.email}</p>

  //             <button
  //               onClick={() => deleteUser(customer._id)}
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
    <div className="customers-page">
      <div className="customers-header">
        <h2>Customers</h2>
        <p>All registered customers in system</p>
      </div>

      <div className="customers-grid">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="customer-card"
            onClick={() => viewOrders(customer._id)}
            style={{ cursor: "pointer" }}
          >
            <div className="avatarr">
              {customer.name?.charAt(0).toUpperCase()}
            </div>

            <div className="details">
              <h3>{customer.name}</h3>
              <p>{customer.email}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // IMPORTANT FIX
                  deleteUser(customer._id);
                }}
                className="deleteBtn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ORDERS SECTION */}
      {selectedCustomer && (
        <div className="orders-section">
          <h3>Customer Orders</h3>

          {customerOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            customerOrders.map((order) => (
              <div key={order._id} className="order-card">
                <h4>Order ID: {order._id}</h4>
                <p>Status: {order.status}</p>

                <div>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.product?.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
