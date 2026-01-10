import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateNewJobPage from "./pages/CreateNewJobPage";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignUpPage from "./pages/SignUpPage";
import EditJobPage from "./pages/EditJobPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

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
      <Route path="/edit-job/:id" element={
          <PrivateRoute>
            <EditJobPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
