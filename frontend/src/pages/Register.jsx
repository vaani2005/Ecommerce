import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert("Registration successful");

      navigate("/");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <select
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
          value={form.role}
        >
          <option value="customer">Customer</option>
          <option value="manager">Manager</option>
        <option value="admin">Admin</option>
        </select>

        <button>Register</button>
      </form>
    </div>
  );
}
