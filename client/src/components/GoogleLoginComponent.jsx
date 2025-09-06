// components/GoogleLoginComponent.jsx
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

function GoogleLoginComponent({setIsauthenticated, setIsadmin, setUser}) {

  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await axios.post(
        `${baseUrl}/auth/login`,
        { token },
        { withCredentials: true }
      );

      const { data } = res;
      if (data.success) {
       setUser(data?.user) // ✅
        setIsauthenticated(true)
        if(data?.user?.role === 'admin'){
          setIsadmin(true)
        }
        toast.success(data.message || "User registered successfully");
        if(data?.user?.role !== 'admin') navigate('/dashboard')
      } else {
        toast.error(data.message || "User registration failed");
      }
    } catch (error) {
      console.error(
        "Error in handleGoogleSuccess in GoogleLoginComponent.jsx ---->>",
        error
      );
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full flex justify-center my-4 border-0  ">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Login Failed");
          toast.error("Google login failed");
        }}
      />
    </div>
  );
}

export default GoogleLoginComponent;
