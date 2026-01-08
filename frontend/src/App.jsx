import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateNewJobPage from "./pages/CreateNewJobPage";
import Logout from "./pages/Logout";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/home" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route path="/create-new-job" element={
          <PrivateRoute>
            <CreateNewJobPage />
          </PrivateRoute>
        }
      />

      

      {/* optional: you can protect this too, or just keep it public */}
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;
