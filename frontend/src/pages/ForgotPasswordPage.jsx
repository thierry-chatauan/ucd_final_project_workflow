import { useState } from "react";
import { Link } from "react-router-dom";
// If you already have an API function, import it here:
// import { requestPasswordReset } from "../api/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setStatus("loading");

    try {
      // ✅ Replace this block with your real API call:
      // await requestPasswordReset(email);

      // Temporary simulated success:
      await new Promise((r) => setTimeout(r, 700));

      setStatus("success");
      setMessage(
        "If an account exists for this email, we’ve sent password reset instructions."
      );
    } catch (err) {
      setStatus("error");
      setMessage(err?.message || "Failed to request reset. Please try again.");
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
      <div className="container py-5" style={{ maxWidth: 520 }}>
        {/* Small brand header (same style as login) */}
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
          <div
            className="fw-bold mx-2 text-dark"
            style={{ letterSpacing: "-0.02em", fontSize: 20 }}
          >
            WorkFlow
          </div>
        </div>

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
                Forgot password
              </div>
              <div className="text-muted small">
                Enter your email and we’ll send reset instructions.
              </div>
            </div>

            {status === "success" && (
              <div
                className="alert border-0 shadow-sm rounded-4"
                style={{ backgroundColor: "rgba(255,255,255,.85)" }}
              >
                <i className="bi bi-check2-circle text-success me-2"></i>
                {message}
              </div>
            )}

            {status === "error" && (
              <div
                className="alert alert-danger border-0 shadow-sm rounded-4"
                style={{ backgroundColor: "rgba(255,255,255,.85)" }}
              >
                <i className="bi bi-exclamation-triangle me-2"></i>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-semibold text-dark">
                  Email
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control border-0 shadow-sm rounded-end-pill"
                    style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary rounded-pill w-100 shadow-sm fw-semibold py-2"
                disabled={status === "loading" || status === "success"}
                type="submit"
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Send reset link
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

        <div className="text-muted small mt-3 text-center">
          © {new Date().getFullYear()} Thierry`s Corporation
        </div>
      </div>
    </div>
  );
}
