import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { getJob, updateJob } from "../api/jobsService";
import { getMe, logout } from "../api/authService";

function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [operator, setOperator] = useState("");
  const [machine, setMachine] = useState("");
  const [customer, setCustomer] = useState("");
  const [drawingNumber, setDrawingNumber] = useState("");
  const [statusValue, setStatusValue] = useState("in_progress");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const meData = await getMe();
        setMe(meData);

        // ✅ client-side guard: only admin can access edit UI
        if (!meData.is_superuser) {
          navigate("/home", { replace: true });
          return;
        }

        const job = await getJob(id);

        setOperator(job.operator ?? "");
        setMachine(job.machine ?? "");
        setCustomer(job.customer ?? "");
        setDrawingNumber(job.drawing_number ?? "");
        setStatusValue(job.status ?? (job.finished_at ? "finished" : "in_progress"));
      } catch (err) {
        if (String(err.message).toLowerCase().includes("401")) {
          logout();
          navigate("/", { replace: true });
          return;
        }
        setError(err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateJob(id, {
        operator,
        machine,
        customer,
        drawing_number: drawingNumber,
        status: statusValue,
      });

      navigate("/home");
    } catch (err) {
      if (String(err.message).toLowerCase().includes("401")) {
        logout();
        navigate("/", { replace: true });
        return;
      }
      setError(err.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-vh-100 bg-dark text-white">
      <Navbar isAdmin={me?.is_superuser} />

      {/* fixes table/header hiding if Navbar is fixed-top */}
      <div style={{ paddingTop: 70 }}>
        <div className="container py-4" style={{ maxWidth: 700 }}>
          <h2 className="mb-4">Edit Job #{id}</h2>

          {loading && <p>Loading...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Operator</label>
                <input
                  className="form-control"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Machine</label>
                <input
                  className="form-control"
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Customer</label>
                <input
                  className="form-control"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Drawing Number</label>
                <input
                  className="form-control"
                  value={drawingNumber}
                  onChange={(e) => setDrawingNumber(e.target.value)}
                  required
                />
              </div>

              {/* Only include if you have status field in the model */}
              <div className="mb-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                >
                  <option value="in_progress">In progress</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-warning" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => navigate("/home")}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditJobPage;
