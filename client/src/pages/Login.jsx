import React from 'react'
import GoogleLoginComponent from "../components/GoogleLoginComponent";


function Login() {
  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body items-center text-center">
          {/* Logo / Title */}
          <h1 className="card-title text-3xl mb-2">🤖 AI Ticket System</h1>
          <p className="text-gray-500 mb-6">
            Smart ticket raising & tracking with the power of AI.
          </p>

          {/* Keep your existing Google login button */}
          <div className="w-full">
            <GoogleLoginComponent />
          </div>

          <p className="text-xs text-gray-400 mt-4">
            By signing in, you agree to our{" "}
            <a href="/terms" className="link link-hover">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
