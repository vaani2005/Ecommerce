import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { getFieldError, hasFieldError } from "../utils/errorHandler";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: undefined,
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      const formattedError = err.formattedError || {
        message: "Registration failed",
        fieldErrors: {},
      };

      if (Object.keys(formattedError.fieldErrors).length > 0) {
        setFieldErrors(formattedError.fieldErrors);
      } else {
        setGeneralError(formattedError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const nameError = getFieldError(fieldErrors, "name");
  const emailError = getFieldError(fieldErrors, "email");
  const passwordError = getFieldError(fieldErrors, "password");

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Register</h2>

        {generalError && <p className="error-text">{generalError}</p>}

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className={hasFieldError(fieldErrors, "name") ? "input-error" : ""}
          />
          {nameError && <span className="field-error">{nameError}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={hasFieldError(fieldErrors, "email") ? "input-error" : ""}
          />
          {emailError && <span className="field-error">{emailError}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={
              hasFieldError(fieldErrors, "password") ? "input-error" : ""
            }
          />
          {passwordError && (
            <span className="field-error">{passwordError}</span>
          )}
        </div>

        <div className="form-group">
          <select name="role" onChange={handleChange} value={form.role}>
            <option value="customer">Customer</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
