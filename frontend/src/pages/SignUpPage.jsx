import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/authService";

function SignupPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await signup({
        username,
        email,
        password,
      });

      // After successful signup, go back to login
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-dark">
      <div className="card bg-secondary text-white p-4" style={{ width: 400 }}>
        <h3 className="text-center mb-3">Create Account</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email (optional)</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-light w-100"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/" className="text-white">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
