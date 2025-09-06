import React from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginComponent from "../components/GoogleLoginComponent";

function Home({ isAuthenticated, isAdmin, setIsauthenticated, setIsadmin, setUser }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden flex flex-row md:flex-row">
      {/* Left section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8 md:px-12 py-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🤖 AI Ticket System
        </h1>
        <p className="text-base md:text-lg text-indigo-100 max-w-md">
          Smart ticket raising and tracking with the power of AI.
        </p>
      </div>

      {/* Right section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Welcome to AI Ticket System
          </h2>
          <p className="text-gray-600 mb-6">
            Raise, manage and track your tickets seamlessly.
          </p>

          {/* Buttons same width & height */}
          <div className="space-y-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full h-12 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white transition"
              >
                Go to Ticket Dashboard
              </button>
            ) : (
              <div className="h-12 w-full flex items-center justify-center rounded-lg border border-gray-100 bg-white">
                {/* Google login button keeps its default look */}
                <GoogleLoginComponent setIsauthenticated={setIsauthenticated} setIsadmin={setIsadmin} setUser={setUser} />
              </div>
            )}


            {/* admin btn */}
            {
              isAdmin  &&  <button
                onClick={() => navigate("/admin")}
                className="w-full h-12 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white transition"
              >
                Go to Admin Dashboard
              </button>
            }
          </div>

          <p className="text-xs text-gray-400 mt-6">
            By signing in, you agree to our{" "}
            <a href="/terms" className="underline hover:text-gray-500">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
