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
  
  // Novos estados para datas
  const [createdAt, setCreatedAt] = useState("");
  const [finishedAt, setFinishedAt] = useState("");

  // Função auxiliar para formatar data da API para o input datetime-local
  const formatForInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    // Retorna YYYY-MM-DDTHH:mm
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const meData = await getMe();
        setMe(meData);

        if (!meData.is_superuser) {
          navigate("/home", { replace: true });
          return;
        }

        const job = await getJob(id);

        setOperator(job.operator?.username ?? "");
        setMachine(job.machine ?? "");
        setCustomer(job.customer ?? "");
        setDrawingNumber(job.drawing_number ?? "");
        setStatusValue(job.status ?? (job.finished_at ? "finished" : "in_progress"));
        
        // Formata as datas para os inputs
        setCreatedAt(formatForInput(job.created_at));
        setFinishedAt(formatForInput(job.finished_at));
        
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
        operator_username: operator, // Enviando o nome se a API permitir
        machine,
        customer,
        drawing_number: drawingNumber,
        status: statusValue,
        created_at: createdAt || null,
        finished_at: finishedAt || null
      });

      navigate("/home");
    } catch (err) {
      setError(err.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="min-vh-100"
      style={{
        background: "radial-gradient(1200px 600px at 20% 0%, rgba(59,130,246,.12), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(16,185,129,.10), transparent 55%), #f8fafc",
      }}
    >
      <Navbar isAdmin={me?.is_superuser} />

      <div style={{ paddingTop: 124 }} className="d-lg-none" />
      <div style={{ paddingTop: 84 }} className="d-none d-lg-block" />

      <div className="container py-4" style={{ maxWidth: 820 }}>
        {/* Header simplificado para focar nos campos */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark m-0">Edit Job <span className="text-muted small">#{id}</span></h2>
          <button className="btn btn-light border rounded-pill shadow-sm" onClick={() => navigate("/home")}>Back</button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4" style={{ backgroundColor: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)" }}>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  {/* ... Campos anteriores (Machine, Customer, Drawing) permanecem iguais ... */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Machine</label>
                    <input className="form-control rounded-pill mb-2" value={machine} onChange={e => setMachine(e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Customer</label>
                    <input className="form-control rounded-pill" value={customer} onChange={e => setCustomer(e.target.value)} required />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Drawing Number</label>
                    <input className="form-control rounded-pill mb-2" value={drawingNumber} onChange={e => setDrawingNumber(e.target.value)} required />
                  </div>

                  {/* NOVOS CAMPOS: DATA E HORA */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-primary"><i className="bi bi-calendar-event me-2"></i>Start Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="form-control border-0 shadow-sm rounded-pill mb-3"
                      style={{ backgroundColor: "#fff" }}
                      value={createdAt}
                      onChange={(e) => setCreatedAt(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-success"><i className="bi bi-calendar-check me-2"></i>Finish Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="form-control border-0 shadow-sm rounded-pill"
                      style={{ backgroundColor: "#fff" }}
                      value={finishedAt}
                      onChange={(e) => setFinishedAt(e.target.value)}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Status</label>
                    <select className="form-select rounded-pill" value={statusValue} onChange={e => setStatusValue(e.target.value)}>
                      <option value="in_progress">In progress</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>

                </div>

                <div className="d-flex gap-2 justify-content-end mt-5">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => navigate("/home")}>Cancel</button>
                  <button type="submit" className="btn btn-warning rounded-pill px-5 fw-bold" disabled={saving}>
                    {saving ? "Saving..." : "Update Job"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditJobPage;