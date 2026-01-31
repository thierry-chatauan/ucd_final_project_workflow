import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateNewJobPage from "./pages/CreateNewJobPage";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignUpPage from "./pages/SignUpPage";
import EditJobPage from "./pages/EditJobPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";


function App() {
  return (
    <Routes>
      
      <Route path="/" element={<LoginPage />} />

      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>}/>

      <Route path="/create-new-job" element={<PrivateRoute><CreateNewJobPage /></PrivateRoute>} />

      <Route path="/edit-job/:id" element={<PrivateRoute><EditJobPage /></PrivateRoute>} />

      <Route path="/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

    </Routes>
  );
}

export default App;
