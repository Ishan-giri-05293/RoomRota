import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import CreateFlat from "../pages/CreateFlat";
import JoinFlat from "../pages/JoinFlat";
import AddChore from "../pages/AddChore";
import AutoAssign from "../pages/AutoAssign";
import Profile from "../pages/Profile";
import Onboarding from "../pages/Onboarding"; // NEW IMPORT
import HousePulse from "../pages/HousePulse";


import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* House Setup Flow */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-flat"
          element={
            <ProtectedRoute>
              <CreateFlat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/join-flat"
          element={
            <ProtectedRoute>
              <JoinFlat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-chore"
          element={
            <ProtectedRoute>
              <AddChore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/auto-assign"
          element={
            <ProtectedRoute>
              <AutoAssign />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:uid"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
  path="/pulse"
  element={
    <ProtectedRoute>
      <HousePulse />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}