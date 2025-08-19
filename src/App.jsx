import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login"; // Your login page (the code you pasted earlier)
import AdminDashboard from "./Component/AdminDashboard";
// import CacDashboard from "./pages/CacDashboard";
// import DistrictDashboard from "./pages/DistrictDashboard";
// import BlockDashboard from "./pages/BlockDashboard";
// import ClusterDashboard from "./pages/ClusterDashboard";

// A simple PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Protected routes - role based */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/cac"
          element={
            <PrivateRoute>
              <CacDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/district"
          element={
            <PrivateRoute>
              <DistrictDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/block"
          element={
            <PrivateRoute>
              <BlockDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/cluster"
          element={
            <PrivateRoute>
              <ClusterDashboard />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}
