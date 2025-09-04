import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./utils/Routing/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginPage from "./components/Login/LoginPage";
import CacListPage from "./components/CacList/CacListPage";
import AnalysisPage from "./components/Analysis/AnalysisPage";
import Submission from "./components/Submission/Submission";
import SchoolVisit from "./components/SchoolVisit/SchoolVisit";
import Question from "./components/Questions/Question";

function Logout() {
  const { logout } = useAuth();
  React.useEffect(() => {
    logout(); // Clear session and redirect
  }, [logout]);

  return <Navigate to="/login" replace />;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route
            path="/submission"
            element={
              <PrivateRoute>
                <Submission />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/list"
            element={
              <PrivateRoute>
                <CacListPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/analysis"
            element={
              <PrivateRoute>
                <AnalysisPage />
              </PrivateRoute>
            }
          ></Route>
           <Route
            path="/visit"
            element={
              <PrivateRoute>
                <SchoolVisit />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/questionnaire"
            element={
              <PrivateRoute>
                <Question />
              </PrivateRoute>
            }
          ></Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
