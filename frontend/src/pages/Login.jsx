import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  getErrorDetails,
  getFieldError,
  hasFieldError,
} from "../utils/errorHandler";
import "./Auth.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      login(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        data.user,
      );

      navigate("/products");
    } catch (err) {
      const formattedError = getErrorDetails(err);

      if (Object.keys(formattedError.fieldErrors).length > 0) {
        setFieldErrors(formattedError.fieldErrors);
      } else {
        setGeneralError(formattedError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const emailError = getFieldError(fieldErrors, "email");
  const passwordError = getFieldError(fieldErrors, "password");

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {generalError && <p className="error-text">{generalError}</p>}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={hasFieldError(fieldErrors, "email") ? "input-error" : ""}
          />
          {emailError && <span className="field-error">{emailError}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={
              hasFieldError(fieldErrors, "password") ? "input-error" : ""
            }
          />
          {passwordError && (
            <span className="field-error">{passwordError}</span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
