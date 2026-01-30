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

      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex align-items-center"
      style={{
        minHeight: "100svh",
        background:
          "radial-gradient(1600px 800px at 10% 0%, rgba(59,130,246,.28), transparent 60%), radial-gradient(1200px 700px at 90% 10%, rgba(16,185,129,.24), transparent 55%), #f8fafc",
      }}
    >
      <div className="container py-5" style={{ maxWidth: 980 }}>
        <div className="row align-items-center g-4">
          {/* Lado esquerdo (branding/descrição) */}
          <div className="col-12 col-lg-6">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div
                className="rounded-4 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 46,
                  height: 46,
                  background: "rgba(59,130,246,.12)",
                  border: "1px solid rgba(59,130,246,.20)",
                }}
              >
                <i className="bi bi-kanban text-primary fs-5"></i>
              </div>
              <div className="fw-bold text-dark" style={{ letterSpacing: "-0.02em", fontSize: 18 }}>
                WorkFlow Tracker
              </div>
            </div>

            <h1 className="fw-bold text-dark mb-2" style={{ letterSpacing: "-0.04em", maxWidth: 520 }}>
              Create your account
            </h1>
            <p className="text-muted mb-4" style={{ maxWidth: 520 }}>
              Join WorkFlow Tracker to track production jobs, monitor machine status, and keep your team aligned with
              a clean, real-time dashboard.
            </p>

            <div className="d-none d-lg-block">
              <div
                className="p-3 rounded-4"
                style={{
                  backgroundColor: "rgba(255,255,255,.65)",
                  border: "1px solid rgba(15,23,42,.08)",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(16,185,129,.12)",
                      border: "1px solid rgba(16,185,129,.18)",
                    }}
                  >
                    <i className="bi bi-shield-check text-success fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">Fast & secure</div>
                    <div className="text-muted small">Create your account in seconds and get started.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Signup */}
          <div className="col-12 col-lg-6">
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{
                backgroundColor: "rgba(255,255,255,.88)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="mb-4">
                  <div className="fw-bold text-dark" style={{ fontSize: 20 }}>
                    Create Account
                  </div>
                  <div className="text-muted small">Fill in your details to get started.</div>
                </div>

                {error && (
                  <div
                    className="alert alert-danger border-0 shadow-sm rounded-4"
                    style={{ backgroundColor: "rgba(255,255,255,.85)" }}
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        className="form-control border-0 shadow-sm rounded-end-pill"
                        style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                        disabled={loading}
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-0 shadow-sm rounded-end-pill"
                        style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        disabled={loading}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 shadow-sm rounded-end-pill"
                        style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                        placeholder="Create a password"
                      />
                    </div>
                  </div>

                  {/* Confirm */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                        <i className="bi bi-check2"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 shadow-sm rounded-end-pill"
                        style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                        placeholder="Repeat your password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill w-100 shadow-sm fw-semibold py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create account
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link to="/" className="text-decoration-none fw-semibold">
                    Back to login
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-muted small mt-3 text-center">© {new Date().getFullYear()} WorkFlow</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
