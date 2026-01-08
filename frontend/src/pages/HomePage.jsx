import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJobs, finishJob, deleteJob } from "../api/jobsService";
import { logout, getMe } from "../api/authService";
import Navbar from "../components/Navbar/Navbar";

function HomePage() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const meData = await getMe();
        setMe(meData);

        const data = await fetchJobs();
        const items = Array.isArray(data) ? data : (data.results ?? []);
        setJobs(items);
      } catch (err) {
        // token missing/expired, etc.
        logout();
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  async function handleFinish(jobId) {
    try {
      const updated = await finishJob(jobId);
      setJobs((prev) => prev.map((j) => (j.id === jobId ? updated : j)));
    } catch (err) {
      setError(err.message || "Failed to finish job");
    }
  }

  async function handleDelete(jobId) {
    const ok = window.confirm("Are you sure you want to delete this job?");
    if (!ok) return;

    try {
      setError("");
      await deleteJob(jobId);

      // remove from UI
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      if (String(err.message).toLowerCase().includes("401")) {
        logout();
        navigate("/");
        return;
      }
      setError(err.message || "Failed to delete job");
    }
  }


  const isAdmin = Boolean(me?.is_superuser);

  return (
    <div className="min-vh-100 bg-dark text-white">
      <Navbar isAdmin={isAdmin} />


      <div style={{ paddingTop: 70 }}>
        <div className="container py-4">
          {loading && <p>Loading...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && (
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Operator</th>
                  <th>Machine</th>
                  <th>Customer</th>
                  <th>Drawing Number</th>
                  <th>Start at</th>
                  <th>Finish at</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.operator}</td>
                    <td>{job.machine}</td>
                    <td>{job.customer}</td>
                    <td>{job.drawing_number}</td>
                    <td>{job.created_at ? new Date(job.created_at).toLocaleString() : "-"}</td>
                    <td>{job.finished_at ? new Date(job.finished_at).toLocaleString() : "-"}</td>
                    <td>{job.status ?? (job.finished_at ? "finished" : "in_progress")}</td>

                    <td className="d-flex gap-2">
                      {/* Normal user actions */}
                      {!isAdmin && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleFinish(job.id)}
                          disabled={Boolean(job.finished_at)}
                        >
                          Finish job
                        </button>
                      )}

                      {/* Admin actions */}
                      {isAdmin && (
                        <>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => navigate(`/edit-job/${job.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(job.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
