import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../api/authService";

function Navbar({ isAdmin = false }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
    console.log("NAVBAR LOADED ✅");
  }

  return (

    <nav className="navbar navbar-dark bg-dark fixed-top navbar-expand">
      <div className="container-fluid">
        <span className="navbar-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
          Workflow Tracker
        </span>

        <div className="navbar-nav me-auto">
          <NavLink to="/home" className="nav-link">Home</NavLink>

          <NavLink to="/create-new-job" className="nav-link">
            Create New Job
          </NavLink>
        </div>

        <button className="btn btn-outline-light" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
