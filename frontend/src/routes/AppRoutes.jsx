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
        <Route
        path="/dashboard"
        element={
         <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        }
      />
        <Route path="/create-flat" element={<CreateFlat />} />
        <Route path="/join-flat" element={<JoinFlat />} />
        <Route path="/add-chore" element={<AddChore />} />
        <Route path="/auto-assign" element={<AutoAssign />} />
        <Route path="/profile/:uid" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}