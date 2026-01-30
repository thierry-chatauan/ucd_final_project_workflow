import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { getProfile, updateProfile, logout } from "../api/authService";

const AVATARS = [
  { id: "avatar1", label: "Developer", emoji: "🧑‍💻" },
  { id: "avatar2", label: "Engineer", emoji: "🧑‍🔧" },
  { id: "avatar3", label: "Astronaut", emoji: "🧑‍🚀" },
  { id: "avatar4", label: "Artist", emoji: "🧑‍🎨" },
  { id: "avatar5", label: "Factory Worker", emoji: "🧑‍🏭" },
  { id: "avatar6", label: "Chef", emoji: "🧑‍🍳" },
  { id: "avatar7", label: "Superhero", emoji: "🦸" },
  { id: "avatar8", label: "Wizard", emoji: "🧙" },
  { id: "avatar9", label: "Ninja", emoji: "🥷" },
  { id: "avatar10", label: "Detective", emoji: "🕵️" },
  { id: "avatar11", label: "Scientist", emoji: "🧑‍🔬" },
  { id: "avatar12", label: "Doctor", emoji: "🧑‍⚕️" },
  { id: "avatar13", label: "Teacher", emoji: "🧑‍🏫" },
  { id: "avatar14", label: "Pilot", emoji: "🧑‍✈️" },
  { id: "avatar15", label: "Firefighter", emoji: "🧑‍🚒" },
  { id: "avatar16", label: "Farmer", emoji: "🧑‍🌾" },
  { id: "avatar17", label: "Mechanic", emoji: "🧑‍🔧" },
  { id: "avatar18", label: "Singer", emoji: "🧑‍🎤" },
  { id: "avatar19", label: "Alien", emoji: "👽" },
  { id: "avatar20", label: "Robot", emoji: "🤖" },
];

function ProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("avatar1");
  const [showAvatars, setShowAvatars] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const data = await getProfile();
        setUsername(data.username || "");
        setEmail(data.email || "");
        setAvatar(data.avatar || "avatar1");
      } catch (err) {
        if (String(err.message).toLowerCase().includes("401")) {
          logout();
          navigate("/", { replace: true });
          return;
        }
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setSavingProfile(true);

      const updated = await updateProfile({ avatar });
      setAvatar(updated.avatar || avatar);

      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  const selectedAvatar = AVATARS.find((a) => a.id === avatar);

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(59,130,246,.12), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(16,185,129,.10), transparent 55%), #f8fafc",
      }}
    >
      <Navbar />

      {/* padding para Navbar em 2 linhas no mobile */}
      <div style={{ paddingTop: 124 }} className="d-lg-none" />
      <div style={{ paddingTop: 84 }} className="d-none d-lg-block" />

      <div className="container py-4" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-4"
              style={{
                width: 44,
                height: 44,
                background: "rgba(59,130,246,.12)",
                border: "1px solid rgba(59,130,246,.20)",
              }}
            >
              <i className="bi bi-person-circle fs-5 text-primary"></i>
            </div>

            <div className="mx-2">
              <h2 className="fw-bold text-dark m-0" style={{ letterSpacing: "-0.03em" }}>
                Profile
              </h2>
              <p className="text-muted m-0">Manage your account details and choose an avatar.</p>
            </div>
          </div>

          <Link
            to="/change-password"
            className="btn btn-light border rounded-pill px-3 shadow-sm fw-semibold"
            style={{ backgroundColor: "rgba(255,255,255,.75)" }}
          >
            <i className="bi bi-shield-lock me-2"></i>
            Change Password
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div
            className="alert alert-danger border-0 shadow-sm rounded-4"
            style={{ backgroundColor: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)" }}
          >
            <i className="bi bi-exclamation-triangle me-2"></i> {error}
          </div>
        )}

        {success && (
          <div
            className="alert alert-success border-0 shadow-sm rounded-4"
            style={{ backgroundColor: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)" }}
          >
            <i className="bi bi-check-circle me-2"></i> {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div
            className="card border-0 shadow-sm rounded-4"
            style={{ backgroundColor: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}
          >
            <div className="card-body p-4 p-md-5 d-flex align-items-center gap-3">
              <div className="spinner-border text-primary" role="status" />
              <div>
                <div className="fw-semibold text-dark">Loading profile…</div>
                <div className="text-muted small">Fetching your account information.</div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}
          >
            <div className="card-body p-4 p-md-5">
              {/* Top info */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: 72,
                    height: 72,
                    background: "rgba(15,23,42,.06)",
                    border: "1px solid rgba(15,23,42,.08)",
                    fontSize: 34,
                  }}
                  title={selectedAvatar?.label}
                >
                  {selectedAvatar?.emoji || "🙂"}
                </div>

                <div className="mx-2">
                  <div className="fw-bold text-dark" style={{ fontSize: 18 }}>
                    {username || "Unnamed user"}
                  </div>
                  <div className="text-muted small">Choose an avatar below.</div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile}>
                {/* Email (read only) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">Email</label>
                  <div
                    className="form-control border-0 shadow-sm rounded-pill"
                    style={{
                      backgroundColor: "rgba(255,255,255,.95)",
                      cursor: "default",
                    }}
                  >
                    <i className="bi bi-envelope me-2 mx-2 text-muted"></i>
                    {email || "No email set"}
                  </div>
                </div>

                {/* Avatar picker */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold text-dark mb-0">Avatar</label>

                    <button
                      type="button"
                      className="btn btn-light border rounded-pill px-3 shadow-sm fw-semibold"
                      onClick={() => setShowAvatars((v) => !v)}
                      style={{ backgroundColor: "rgba(255,255,255,.75)" }}
                    >
                      <i className={`bi ${showAvatars ? "bi-chevron-up" : "bi-chevron-down"} me-2`} />
                      {showAvatars ? "Hide" : "Choose"}
                    </button>
                  </div>

                  {showAvatars && (
                    <div
                      className="p-3 rounded-4"
                      style={{
                        background: "rgba(15,23,42,.04)",
                        border: "1px solid rgba(15,23,42,.08)",
                      }}
                    >
                      <div className="row g-2">
                        {AVATARS.map((a) => {
                          const active = avatar === a.id;

                          return (
                            <div className="col-3 col-sm-2" key={a.id}>
                              <button
                                type="button"
                                onClick={() => setAvatar(a.id)}
                                title={a.label}
                                className="w-100 d-flex align-items-center justify-content-center rounded-4 shadow-sm"
                                style={{
                                  height: 52,
                                  border: active
                                    ? "2px solid rgba(59,130,246,.60)"
                                    : "1px solid rgba(15,23,42,.10)",
                                  backgroundColor: active
                                    ? "rgba(59,130,246,.12)"
                                    : "rgba(255,255,255,.85)",
                                  fontSize: "1.6rem",
                                  transition: "transform .08s ease",
                                }}
                              >
                                {a.emoji}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-muted small mt-3">
                        Selected: <span className="fw-semibold">{selectedAvatar?.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-4" style={{ opacity: 0.08 }} />

                {/* Actions */}
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-light border rounded-pill px-4 shadow-sm fw-semibold"
                    style={{ backgroundColor: "rgba(255,255,255,.75)" }}
                    onClick={() => navigate("/home")}
                    disabled={savingProfile}
                  >
                    Back
                  </button>

                  <button
                    className="btn btn-primary rounded-pill px-4 shadow-sm fw-semibold"
                    disabled={savingProfile}
                    type="submit"
                  >
                    {savingProfile ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2 me-2"></i>
                        Save profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="text-muted small mt-3">
          Tip: pick an avatar to make your account easier to recognize.
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
