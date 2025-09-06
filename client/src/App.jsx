import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import TermsAndConditions from "../src/pages/TermsAndConditions";
import Admin from "./pages/Admin";
import AllUsers from "./pages/AllUsers";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TicketDetails from "./pages/TicketDetails";
import CheckAdmin from "./utils/CheckAdmin";
import ProtectedRoute from "./utils/ProtectedRoute";

const baseUrl = import.meta.env.VITE_BASE_URL;

function App() {
  const [isAuthenticated, setIsauthenticated] = useState(false);
  const [isAdmin, setIsadmin] = useState(false);
  const [user, setUser] = useState(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${baseUrl}/auth/profile`, {
        withCredentials: true,
      });
      const { data } = res; // return or use data as needed
      if (data.success) {
        setUser(data?.user);
        setIsCheckingAuth(false);
        setIsauthenticated(true);
        setIsadmin(data?.user?.role === "admin");
      }
    } catch (error) {
      console.error("Error in fetchProfile in App.jsx --->>", error);
      console.error(
        "Error in ProfileHandler:",
        error.response?.data || error.message
      );
      return null;
    } finally {
      setIsCheckingAuth(false); // Done checking auth
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-black flex justify-center items-center z-[9999]">
        <span className="loading loading-spinner text-primary"></span>
        <span className="loading loading-spinner text-secondary"></span>
        <span className="loading loading-spinner text-success"></span>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              setIsadmin={setIsadmin}
              setIsauthenticated={setIsauthenticated}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ticket/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TicketDetails user={user} />
            </ProtectedRoute>
          }
        />

        <Route path="terms" element={<TermsAndConditions />} />

        <Route
          path="/admin"
          element={
            <CheckAdmin isAdmin={isAdmin}>
              <Admin user={user} setUser={setUser} />
            </CheckAdmin>
          }
        />

        <Route
          path="/admin/allusers"
          element={
            <CheckAdmin isAdmin={isAdmin}>
              <AllUsers user={user} setUser={setUser} />
            </CheckAdmin>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
