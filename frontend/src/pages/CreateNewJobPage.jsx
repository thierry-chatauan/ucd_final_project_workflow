import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { createJob } from "../api/jobsService";
import { logout } from "../api/authService";

function CreateNewJobPage() {
  const navigate = useNavigate();

  const [operator, setOperator] = useState("");
  const [machine, setMachine] = useState("");
  const [customer, setCustomer] = useState("");
  const [drawingNumber, setDrawingNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // payload keys must match your Django model/serializer fields
      await createJob({
        operator,
        machine,
        customer,
        drawing_number: drawingNumber,
      });

      navigate("/home");
    } catch (err) {
      // if token missing/expired
      if (String(err.message).toLowerCase().includes("401")) {
        logout();
        navigate("/");
        return;
      }
      setError(err.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 bg-dark text-white">
      <Navbar />

      <div className="container py-5" style={{ maxWidth: 700 }}>
        <h2 className="mb-4">Create New Job</h2>

        {error && <div className="alert alert-danger">{error}</div>}

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

          <div className="mb-4">
            <label className="form-label">Drawing Number</label>
            <input
              className="form-control"
              value={drawingNumber}
              onChange={(e) => setDrawingNumber(e.target.value)}
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => navigate("/home")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewJobPage;
