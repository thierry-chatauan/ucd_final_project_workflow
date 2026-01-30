import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { createJob } from "../api/jobsService";
import { getMe, logout } from "../api/authService";

const AVATAR_EMOJI = {
  avatar1: "🧑‍💻",
  avatar2: "🧑‍🔧",
  avatar3: "🧑‍🚀",
  avatar4: "🧑‍🎨",
  avatar5: "🧑‍🏭",
  avatar6: "🧑‍🍳",
  avatar7: "🦸",
  avatar8: "🧙",
  avatar9: "🥷",
  avatar10: "🕵️",
  avatar11: "🧑‍🔬",
  avatar12: "🧑‍⚕️",
  avatar13: "🧑‍🏫",
  avatar14: "🧑‍✈️",
  avatar15: "🧑‍🚒",
  avatar16: "🧑‍🌾",
  avatar17: "🧑‍🔧",
  avatar18: "🧑‍🎤",
  avatar19: "👽",
  avatar20: "🤖",
};

function CreateNewJobPage() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);

  const [machine, setMachine] = useState("");
  const [customer, setCustomer] = useState("");
  const [drawingNumber, setDrawingNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const meData = await getMe();
        setMe(meData);
      } catch (err) {
        logout();
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setSaving(true);

      await createJob({
        machine,
        customer,
        drawing_number: drawingNumber,
      });

      navigate("/home");
    } catch (err) {
      setError(err?.message || "Failed to create job");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(59,130,246,.12), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(16,185,129,.10), transparent 55%), #f8fafc",
      }}
    >
      <Navbar />

      {/* same spacing pattern you used on HomePage */}
      <div style={{ paddingTop: 124 }} className="d-lg-none" />
      <div style={{ paddingTop: 84 }} className="d-none d-lg-block" />

      <div className="container py-4" style={{ maxWidth: 980 }}>
        {/* Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">
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
              <i className="bi bi-plus-square fs-5 text-primary"></i>
            </div>

            <div>
              <h2 className="fw-bold text-dark m-0 mx-2" style={{ letterSpacing: "-0.03em" }}>
                Create New Job
              </h2>
              <p className="text-muted m-0 mx-2">
                Register a new production order and start tracking progress.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-light border rounded-pill px-3 shadow-sm"
              onClick={() => navigate("/home")}
              style={{ backgroundColor: "rgba(255,255,255,.75)" }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>
          </div>
        </div>

        {loading && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger border-0 shadow-sm rounded-4"
            style={{ backgroundColor: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)" }}
          >
            <i className="bi bi-exclamation-triangle me-2"></i> {error}
          </div>
        )}

        {!loading && (
          <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}
          >
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <div className="fw-semibold text-dark">New Job</div>
              <div className="text-muted small">Fields marked with * are required</div>
            </div>

            <div className="p-4">
              {/* Operator info (auto-filled) */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: 44,
                    height: 44,
                    background: "rgba(59,130,246,.12)",
                    border: "1px solid rgba(59,130,246,.18)",
                    fontSize: 22,
                  }}
                  title={me?.username}
                >
                  {AVATAR_EMOJI[me?.avatar] || "🙂"}
                </div>

                <div className="mx-2">
                  <div className="text-muted small">Operator</div>
                  <div className="fw-semibold text-dark">{me?.username || "-"}</div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold">
                      Machine <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={machine}
                      onChange={(e) => setMachine(e.target.value)}
                      placeholder="e.g. Doosan 6700"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold">
                      Customer <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      placeholder="e.g. Siemens"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-dark fw-semibold">
                      Drawing Number <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={drawingNumber}
                      onChange={(e) => setDrawingNumber(e.target.value)}
                      placeholder="e.g. DRW-401223432"
                      required
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 shadow-sm fw-semibold"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>
                        Register
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-light border rounded-pill px-4 shadow-sm fw-semibold mx-2"
                    onClick={() => navigate("/home")}
                    disabled={saving}
                    style={{ backgroundColor: "rgba(255,255,255,.75)" }}
                  >
                    Cancel
                  </button>
                </div>

                <div className="text-muted small mt-3">
                  The operator is assigned automatically based on your logged-in account.
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateNewJobPage;
