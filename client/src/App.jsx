import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginSuccess } from "./store/authSlice";
import Dashboard from './pages/Dashboard'
import TradeForm from "./components/TradeForm";
import AddTrade from "./pages/AddTrade";
import ViewTrades from "./pages/ViewTrades";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(logout());
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/get-user", {
          method: "GET",
          headers : {
            "x-auth-token" : token,
          }
        });

        if (response.ok) {
          const userData = await response.json();
          // 3. Token is valid, update Redux
          dispatch(loginSuccess(userData));
        } else {
          // Token expired or invalid
          throw new Error("Invalid token");
        }
      } catch (error) {
        // 4. Clean up if token verification fails
        localStorage.removeItem("token");
        dispatch(logout());
      }
    };

    verifyToken();
  }, [dispatch]);

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
      </Routes>
    </Router>
  );
}

export default App;
