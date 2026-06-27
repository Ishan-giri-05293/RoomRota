import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import CreateFlat from "../pages/CreateFlat";
import JoinFlat from "../pages/JoinFlat";
import AddChore from "../pages/AddChore";
import AutoAssign from "../pages/AutoAssign";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Group */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-flat" element={<ProtectedRoute><CreateFlat /></ProtectedRoute>} />
        <Route path="/join-flat" element={<ProtectedRoute><JoinFlat /></ProtectedRoute>} />
        <Route path="/add-chore" element={<ProtectedRoute><AddChore /></ProtectedRoute>} />
        <Route path="/auto-assign" element={<ProtectedRoute><AutoAssign /></ProtectedRoute>} />
        <Route path="/profile/:uid" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}