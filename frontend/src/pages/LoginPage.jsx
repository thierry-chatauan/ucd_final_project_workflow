import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      navigate("/home");
    } catch (err) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-dark">
      <div className="card bg-secondary text-white p-4" style={{ width: 360 }}>
        <h3 className="text-center mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-light w-100">Login</button>
        </form>

        {/* ✅ SIGNUP LINK */}
        <div className="text-center mt-3">
          <Link to="/signup" className="text-white">
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
