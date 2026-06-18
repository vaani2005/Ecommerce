import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function NotFound() {
  const { user } = useAuth();

  return (
    // <div className="auth-container">
    //   <div className="auth-card">
    //     <h2>404 - Page Not Found</h2>
    //     <p
    //       style={{
    //         marginTop: "1rem",
    //         marginBottom: "1rem",
    //         textAlign: "center",
    //       }}
    //     >
    //       The page you&apos;re looking for doesn&apos;t exist.
    //     </p>
    //     <Link
    //       to={user ? "/products" : "/"}
    //       style={{
    //         display: "inline-block",
    //         marginTop: "1rem",
    //         padding: "0.5rem 1rem",
    //         backgroundColor: "#007bff",
    //         color: "white",
    //         textDecoration: "none",
    //         borderRadius: "4px",
    //         textAlign: "center",
    //       }}
    //     >
    //       {user ? "Go to Products" : "Go to Login"}
    //     </Link>
    //   </div>
    // </div>
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h2>404 - Page Not Found</h2>

        <p
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <Link
          to={user ? "/products" : "/"}
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          {user ? "Go to Products" : "Go to Login"}
        </Link>
      </div>
    </div>
  );
}
