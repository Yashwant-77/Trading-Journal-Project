import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginSuccess } from "./store/authSlice";
import Dashboard from "./pages/Dashboard";

import AddTrade from "./pages/AddTrade";
import ViewTrades from "./pages/ViewTrades";
import API from "./api";
import { setTrades } from "./store/tradesSlice";
import CreatePlaybook from "./pages/CreatePlaybook";
import Playbooks from "./pages/Playbooks";
import { setPlaybooks } from "./store/playbooksSlice";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem("token");

      // 1. No token -> user is logged out
      if (!token) {
        dispatch(logout());
        return;
      }

      try {
        // 2. Verify token first
        const response = await fetch(
          "http://localhost:5000/api/auth/get-user",
          {
            method: "GET",
            headers: {
              "x-auth-token": token,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        // 3. Token is valid
        const userData = await response.json();

        dispatch(loginSuccess(userData));

        // 4. Only now fetch user data
        const [tradesResponse, playbooksResponse] = await Promise.all([
          API.get("/trades"),
          API.get("/playbooks"),
        ]);

        // console.log(tradesResponse.data);
        // console.log(playbooksResponse.data);

        // 5. Store everything in Redux
        dispatch(setTrades(tradesResponse.data));

        dispatch(setPlaybooks(playbooksResponse.data.playbooks || []));
      } catch (error) {
        console.error("App initialization error:", error);

        // Token invalid / expired
        localStorage.removeItem("token");

        dispatch(logout());
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className=" flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/add-trade"
          element={
            isAuthenticated ? <AddTrade /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/view-trades"
          element={
            isAuthenticated ? <ViewTrades /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/playbooks/new" element={<CreatePlaybook />} />

        <Route path="/playbooks" element={<Playbooks />} />
        <Route
          path="/calendar"
          element={
            isAuthenticated ? <Calendar /> : <Navigate to="/login" replace />
          }
        />
        <Route
  path="/settings"
  element={
    isAuthenticated ? <Settings/> : <Navigate to='/login' replace />
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
