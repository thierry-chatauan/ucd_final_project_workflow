import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { fetchJobs, finishJob, deleteJob } from "../api/jobsService";
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

function HomePage() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state (mobile)
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  const isAdmin = Boolean(me?.is_superuser);

  const openJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const closeJob = () => {
    setShowJobModal(false);
    setSelectedJob(null);
  };

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const meData = await getMe();
      setMe(meData);

      const data = await fetchJobs();
      const items = Array.isArray(data) ? data : data?.results ?? [];
      setJobs(items);
    } catch (err) {
      logout();
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  async function handleFinish(jobId) {
    try {
      setError("");
      const updated = await finishJob(jobId);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));

      // keep modal in sync if open
      setSelectedJob((prev) => (prev?.id === jobId ? updated : prev));
    } catch (err) {
      setError(err?.message || "Failed to finish job");
    }
  }

  async function handleDelete(jobId) {
    const ok = window.confirm("Are you sure you want to delete this job?");
    if (!ok) return;

    try {
      setError("");
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));

      if (selectedJob?.id === jobId) closeJob();
    } catch (err) {
      if (String(err?.message || "").toLowerCase().includes("401")) {
        logout();
        navigate("/", { replace: true });
        return;
      }
      setError(err?.message || "Failed to delete job");
    }
  }

  const stats = useMemo(() => {
    const finished = jobs.filter((j) => j.status === "finished").length;
    const inProgress = jobs.length - finished;
    return { finished, inProgress };
  }, [jobs]);

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(59,130,246,.12), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(16,185,129,.10), transparent 55%), #f8fafc",
      }}
    >
      <Navbar isAdmin={isAdmin} />

      {/* Navbar spacing (2 lines on mobile) */}
      <div style={{ paddingTop: 124 }} className="d-lg-none" />
      <div style={{ paddingTop: 84 }} className="d-none d-lg-block" />

      <div className="container py-4">
        {/* Top Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">
          <div>
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
                <i className="bi bi-kanban fs-5 text-primary"></i>
              </div>

              <div>
                <h2 className="fw-bold text-dark m-0" style={{ letterSpacing: "-0.03em" }}>
                  Jobs Dashboard
                </h2>
                <p className="text-muted m-0">
                  Monitor and manage production orders and machine status.
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-light border rounded-pill px-3 shadow-sm"
              onClick={loadData}
              disabled={loading}
              title="Refresh"
              style={{ backgroundColor: "rgba(255,255,255,.75)" }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <i className="bi bi-arrow-clockwise me-2"></i>
              )}
              Refresh
            </button>

            {/* ✅ show New Job for any logged user */}
            {me && (
              <button
                className="btn btn-primary rounded-pill px-4 shadow-sm fw-semibold"
                onClick={() => navigate("/create-new-job")}
              >
                <i className="bi bi-plus-lg me-2"></i>
                New Job
              </button>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{ backgroundColor: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)" }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small">Total Jobs</div>
                  <div className="fs-3 fw-bold text-dark">{jobs.length}</div>
                </div>
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, background: "rgba(2,132,199,.12)" }}
                >
                  <i className="bi bi-list-check fs-4 text-info"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{ backgroundColor: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)" }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small">In Progress</div>
                  <div className="fs-3 fw-bold text-dark">{stats.inProgress}</div>
                </div>
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, background: "rgba(245,158,11,.14)" }}
                >
                  <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{ backgroundColor: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)" }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small">Finished</div>
                  <div className="fs-3 fw-bold text-dark">{stats.finished}</div>
                </div>
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, background: "rgba(16,185,129,.12)" }}
                >
                  <i className="bi bi-check2-circle fs-4 text-success"></i>
                </div>
              </div>
            </div>
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

        {/* ✅ MOBILE: cards list */}
        {!loading && (
          <div className="d-md-none">
            {jobs.length === 0 ? (
              <div
                className="card border-0 shadow-sm rounded-4"
                style={{ backgroundColor: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}
              >
                <div className="card-body text-center py-5">
                  <div
                    className="mx-auto mb-3 rounded-4 d-flex align-items-center justify-content-center"
                    style={{ width: 64, height: 64, background: "rgba(148,163,184,.18)" }}
                  >
                    <i className="bi bi-inbox fs-3 text-secondary"></i>
                  </div>
                  <div className="fw-semibold text-dark">No jobs yet</div>
                  <div className="text-muted small">Create a new job to start tracking production.</div>
                  {me && (
                    <button
                      className="btn btn-primary rounded-pill px-4 mt-3 shadow-sm fw-semibold"
                      onClick={() => navigate("/create-new-job")}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      New Job
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {jobs.map((job) => {
                  const finished = job.status === "finished";

                  return (
                    <button
                      key={job.id}
                      type="button"
                      className="card border-0 shadow-sm rounded-4 text-start"
                      style={{
                        backgroundColor: "rgba(255,255,255,.88)",
                        backdropFilter: "blur(8px)",
                      }}
                      onClick={() => openJob(job)}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            <div className="fw-bold text-dark">
                              #{job.id} • {job.drawing_number}
                            </div>
                            <div className="text-muted small">
                              {job.customer} • {job.machine}
                            </div>

                            <div className="d-flex align-items-center gap-2 mt-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                  width: 28,
                                  height: 28,
                                  background: "rgba(59,130,246,.12)",
                                  border: "1px solid rgba(59,130,246,.18)",
                                  fontSize: 14,
                                }}
                                title={job.operator?.username}
                              >
                                {AVATAR_EMOJI[job.operator?.avatar] || "🙂"}
                              </div>
                              <div className="text-dark fw-semibold">
                                {job.operator?.username || "-"}
                              </div>
                            </div>
                          </div>

                          <span
                            className="badge rounded-pill px-3 py-2 fw-semibold"
                            style={{
                              backgroundColor: finished
                                ? "rgba(16,185,129,.14)"
                                : "rgba(245,158,11,.16)",
                              color: finished ? "#065f46" : "#92400e",
                              border: "1px solid rgba(15,23,42,.08)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {finished ? "Finished" : "In Progress"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ✅ DESKTOP: table */}
        {!loading && (
          <div
            className="d-none d-md-block card border-0 shadow-sm rounded-4 overflow-hidden mt-4"
            style={{ backgroundColor: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}
          >
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <div className="fw-semibold text-dark">Jobs</div>
              <div className="text-muted small">{jobs.length} records</div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead style={{ backgroundColor: "rgba(15,23,42,.03)" }}>
                  <tr className="text-secondary small fw-bold text-uppercase">
                    <th className="ps-4 py-3">ID</th>
                    <th>Operator</th>
                    <th>Machine</th>
                    <th>Customer</th>
                    <th>Drawing</th>
                    <th>Timeline</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-5">
                        <div className="text-center">
                          <div
                            className="mx-auto mb-3 rounded-4 d-flex align-items-center justify-content-center"
                            style={{ width: 64, height: 64, background: "rgba(148,163,184,.18)" }}
                          >
                            <i className="bi bi-inbox fs-3 text-secondary"></i>
                          </div>
                          <div className="fw-semibold text-dark">No jobs yet</div>
                          <div className="text-muted small">
                            Create a new job to start tracking production.
                          </div>
                          {me && (
                            <button
                              className="btn btn-primary rounded-pill px-4 mt-3 shadow-sm fw-semibold"
                              onClick={() => navigate("/create-new-job")}
                            >
                              <i className="bi bi-plus-lg me-2"></i>
                              New Job
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => {
                      const finished = job.status === "finished";

                      return (
                        <tr key={job.id} className="border-top">
                          <td className="ps-4">
                            <span className="text-muted fw-semibold">#{job.id}</span>
                          </td>

                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                  width: 34,
                                  height: 34,
                                  background: "rgba(59,130,246,.12)",
                                  border: "1px solid rgba(59,130,246,.18)",
                                  fontSize: 18,
                                }}
                                title={job.operator?.username}
                              >
                                {AVATAR_EMOJI[job.operator?.avatar] || "🙂"}
                              </div>

                              <div className="fw-semibold text-dark">
                                {job.operator?.username || "-"}
                              </div>
                            </div>
                          </td>

                          <td className="fw-semibold" style={{ color: "#0f172a" }}>
                            <span
                              className="badge rounded-pill px-3 py-2"
                              style={{
                                backgroundColor: "rgba(99,102,241,.12)",
                                color: "#3730a3",
                                border: "1px solid rgba(99,102,241,.18)",
                              }}
                            >
                              {job.machine}
                            </span>
                          </td>

                          <td className="text-dark">{job.customer}</td>

                          <td>
                            <span
                              className="badge rounded-pill px-3 py-2 fw-semibold"
                              style={{
                                backgroundColor: "rgba(15,23,42,.06)",
                                color: "#0f172a",
                                border: "1px solid rgba(15,23,42,.10)",
                              }}
                            >
                              {job.drawing_number}
                            </span>
                          </td>

                          <td className="small">
                            <div className="text-muted mb-1">
                              <span className="fw-semibold text-dark">Start:</span>{" "}
                              {job.created_at
                                ? new Date(job.created_at).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-"}
                            </div>
                            {job.finished_at && (
                              <div className="text-success">
                                <span className="fw-semibold">End:</span>{" "}
                                {new Date(job.finished_at).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}
                          </td>

                          <td>
                            <span
                              className="badge rounded-pill px-3 py-2 fw-semibold"
                              style={{
                                backgroundColor: finished
                                  ? "rgba(16,185,129,.14)"
                                  : "rgba(245,158,11,.16)",
                                color: finished ? "#065f46" : "#92400e",
                                border: "1px solid rgba(15,23,42,.08)",
                              }}
                            >
                              <i
                                className={`bi ${
                                  finished ? "bi-check2-circle" : "bi-hourglass-split"
                                } me-2`}
                              ></i>
                              {finished ? "Finished" : "In Progress"}
                            </span>
                          </td>

                          <td className="text-end pe-4">
                            <div className="d-inline-flex align-items-center gap-2">
                              {!isAdmin && (
                                <button
                                  className="btn btn-sm rounded-pill px-3 fw-semibold shadow-sm"
                                  style={{
                                    backgroundColor: finished
                                      ? "rgba(148,163,184,.25)"
                                      : "rgba(16,185,129,.16)",
                                    border: "1px solid rgba(15,23,42,.10)",
                                    color: finished ? "#64748b" : "#065f46",
                                  }}
                                  onClick={() => handleFinish(job.id)}
                                  disabled={finished}
                                  type="button"
                                >
                                  <i className="bi bi-check-lg me-2"></i>
                                  Finish
                                </button>
                              )}

                              {isAdmin && (
                                <>
                                  <button
                                    className="btn btn-sm btn-light border shadow-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-2"
                                    onClick={() => navigate(`/edit-job/${job.id}`)}
                                    title="Edit"
                                    type="button"
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                    Edit
                                  </button>

                                  <button
                                    className="btn btn-sm btn-light border shadow-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-2"
                                    onClick={() => handleDelete(job.id)}
                                    title="Delete"
                                    type="button"
                                  >
                                    <i className="bi bi-trash text-danger"></i>
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Modal (mobile details + actions) */}
      {showJobModal && selectedJob && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
            onClick={closeJob}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="modal-header border-0">
                  <div>
                    <div className="fw-bold">Job #{selectedJob.id}</div>
                    <div className="text-muted small">{selectedJob.drawing_number}</div>
                  </div>
                  <button type="button" className="btn-close" onClick={closeJob} />
                </div>

                <div className="modal-body">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: 34,
                        height: 34,
                        background: "rgba(59,130,246,.12)",
                        border: "1px solid rgba(59,130,246,.18)",
                        fontSize: 18,
                      }}
                      title={selectedJob.operator?.username}
                    >
                      {AVATAR_EMOJI[selectedJob.operator?.avatar] || "🙂"}
                    </div>
                    <div className="fw-semibold">{selectedJob.operator?.username || "-"}</div>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <div>
                      <span className="text-muted">Machine:</span>{" "}
                      <span className="fw-semibold">{selectedJob.machine}</span>
                    </div>
                    <div>
                      <span className="text-muted">Customer:</span>{" "}
                      <span className="fw-semibold">{selectedJob.customer}</span>
                    </div>
                    <div>
                      <span className="text-muted">Start:</span>{" "}
                      {selectedJob.created_at
                        ? new Date(selectedJob.created_at).toLocaleString("en-GB")
                        : "-"}
                    </div>
                    <div>
                      <span className="text-muted">Finish:</span>{" "}
                      {selectedJob.finished_at
                        ? new Date(selectedJob.finished_at).toLocaleString("en-GB")
                        : "-"}
                    </div>
                    <div>
                      <span className="text-muted">Status:</span>{" "}
                      <span className="fw-semibold">
                        {selectedJob.status === "finished" ? "Finished" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 d-flex gap-2">
                  {!isAdmin && (
                    <button
                      className="btn btn-success rounded-pill px-4 fw-semibold"
                      onClick={async () => {
                        await handleFinish(selectedJob.id);
                        closeJob();
                      }}
                      disabled={selectedJob.status === "finished"}
                      type="button"
                    >
                      Finish
                    </button>
                  )}

                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-light border rounded-pill px-4 fw-semibold"
                        onClick={() => navigate(`/edit-job/${selectedJob.id}`)}
                        type="button"
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger rounded-pill px-4 fw-semibold"
                        onClick={async () => {
                          await handleDelete(selectedJob.id);
                          closeJob();
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  <button
                    className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
                    onClick={closeJob}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={closeJob} style={{ opacity: 0.8 }} />
        </>
      )}
    </div>
  );
}

export default HomePage;
