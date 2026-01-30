import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(username, password);
      navigate("/home");
    } catch (err) {
      setError("Invalid credentials");
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
          "radial-gradient(1600px 800px at 10% 0%, rgba(59,130,246,.28), transparent 60%), radial-gradient(1200px 700px at 90% 10%, rgba(16,185,129,.24), transparent 55%), #f8fafc"

      }}

    >
      <div className="container py-5" style={{ maxWidth: 980 }}>
        <div className="row align-items-center g-4">
          {/* Lado esquerdo (branding + descrição) */}
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
              <div className="fw-bold mx-2 text-dark" style={{ letterSpacing: "-0.02em", fontSize: 20 }}>
                WorkFlow
              </div>
            </div>

            <h1 className="fw-bold text-dark mb-2" style={{ letterSpacing: "-0.04em", maxWidth: 520 }}>
              Production control, simplified
            </h1>

            <p className="text-muted mb-4" style={{ maxWidth: 520 }}>
              WorkFlow helps your team track production jobs, monitor machine activity, and keep orders
              moving smoothly — all in one clean, real-time dashboard.
            </p>

            {/* Feature bullets */}
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(59,130,246,.12)",
                    border: "1px solid rgba(59,130,246,.20)",
                  }}
                >
                  <i className="bi bi-speedometer2 text-primary"></i>
                </div>
                <div className="mx-2">
                  <div className="fw-semibold text-dark">Live production status</div>
                  <div className="text-muted small">
                    See which jobs are running, finished, or waiting — updated in real time.
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(245,158,11,.14)",
                    border: "1px solid rgba(245,158,11,.22)",
                  }}
                >
                  <i className="bi bi-cpu text-warning"></i>
                </div>
                <div className="mx-2"> 
                  <div className="fw-semibold text-dark">Machine tracking</div>
                  <div className="text-muted small">
                    Know exactly which machine is working on which order at any moment.
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(16,185,129,.14)",
                    border: "1px solid rgba(16,185,129,.22)",
                  }}
                >
                  <i className="bi bi-check2-circle text-success"></i>
                </div>
                <div className="mx-2">
                  <div className="fw-semibold text-dark">Clear job history</div>
                  <div className="text-muted small">
                    Track completed jobs, timelines, and accountability with a single click.
                  </div>
                </div>
              </div>
            </div>

            {/* Security card */}
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
                  <div className="mx-2">
                    <div className="fw-semibold text-dark">Secure & role-based</div>
                    <div className="text-muted small">
                      Admins manage jobs. Operators focus on production. Everything stays protected.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Card de Login */}
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
                    Login
                  </div>
                  <div className="text-muted small">Enter your credentials to access the dashboard.</div>
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
                        required
                        autoComplete="username"
                        placeholder="Enter your username"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
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
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary rounded-pill w-100 shadow-sm fw-semibold py-2"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link to="/signup" className="text-decoration-none fw-semibold">
                    Create a new account
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-muted small mt-3 text-center">© {new Date().getFullYear()} Thierry`s Corporation</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
