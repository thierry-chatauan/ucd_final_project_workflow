import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { changePassword, logout } from "../api/authService";

function ChangePasswordPage() {
  const navigate = useNavigate();

  const [savingPwd, setSavingPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  async function handleChangePassword(e) {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setSavingPwd(true);

      await changePassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      // Logout após mudança de senha (recomendado)
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setSavingPwd(false);
    }
  }

  return (
  <div
    className="d-flex flex-column"
    style={{
      minHeight: "100svh",
      background:
        "radial-gradient(1600px 800px at 10% 0%, rgba(59,130,246,.28), transparent 60%), radial-gradient(1200px 700px at 90% 10%, rgba(16,185,129,.24), transparent 55%), #f8fafc",
    }}
  >
    <Navbar />

    <div style={{ paddingTop: 70 }} className="flex-grow-1 d-flex align-items-center">
      <div className="container py-5" style={{ maxWidth: 980 }}>
        <div className="row align-items-center g-4">
          {/* LEFT SIDE */}
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
                <i className="bi bi-shield-lock text-primary fs-5"></i>
              </div>
              <div className="fw-bold text-dark mx-2" style={{ fontSize: 18 }}>
                WorkFlow Tracker
              </div>
            </div>

            <h1
              className="fw-bold text-dark mb-2"
              style={{ letterSpacing: "-0.04em" }}
            >
              Change your password
            </h1>

            <p className="text-muted mb-4" style={{ maxWidth: 520 }}>
              Keep your account secure by updating your password regularly.
            </p>

            <Link
              to="/profile"
              className="btn btn-outline-dark btn-sm rounded-pill px-3"
            >
              ← Back to Profile
            </Link>

            <div className="d-none d-lg-block mt-4">
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
                      background: "rgba(245,158,11,.12)",
                      border: "1px solid rgba(245,158,11,.18)",
                    }}
                  >
                    <i className="bi bi-exclamation-triangle text-warning fs-5"></i>
                  </div>
                  <div className="mx-2">
                    <div className="fw-semibold text-dark">Heads up</div>
                    <div className="text-muted small">
                      You will be logged out after changing your password.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD */}
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
                    Update Password
                  </div>
                  <div className="text-muted small">
                    Enter your current password and choose a new one.
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 shadow-sm rounded-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success border-0 shadow-sm rounded-4">
                    <i className="bi bi-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                <form onSubmit={handleChangePassword}>
                  {/* Current */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Current Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 shadow-sm rounded-end-pill"
                        style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        disabled={savingPwd}
                      />
                    </div>
                  </div>

                  {/* New */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      New Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                        <i className="bi bi-key"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 shadow-sm rounded-end-pill"
                        style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        minLength={6}
                        disabled={savingPwd}
                      />
                    </div>
                    <div className="form-text text-muted">
                      Minimum 6 characters
                    </div>
                  </div>

                  {/* Confirm */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      Confirm New Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 shadow-sm rounded-start-pill">
                        <i className="bi bi-check2"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 shadow-sm rounded-end-pill"
                        style={{ backgroundColor: "rgba(255,255,255,.95)" }}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        minLength={6}
                        disabled={savingPwd}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-warning rounded-pill w-100 fw-semibold py-2"
                    disabled={savingPwd}
                  >
                    {savingPwd ? "Updating..." : "Update Password"}
                  </button>

                  <div className="alert alert-info border-0 shadow-sm rounded-4 mt-3 mb-0">
                    <small>
                      ⚠️ You will be logged out automatically after updating your password.
                    </small>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-muted small mt-3 text-center">
              © {new Date().getFullYear()} WorkFlow
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default ChangePasswordPage;