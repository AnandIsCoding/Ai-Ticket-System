import React, { useState } from "react";
import { useLogoutHandler } from "../utils/logoutHandler";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from 'react-hot-toast'

const baseUrl = import.meta.env.VITE_BASE_URL;

function Dashboard({ setUser, user }) {
  const [title, setTitle] = useState(" Access Denied to Shared Drive");
  const [description, setDescription] = useState(`'m unable to access the 'Marketing_Assets' folder on the shared drive. When I try to open it, I get an "Access Denied" error message. My colleagues in the marketing department have access. Please grant me the necessary permissions.`);

  const [allTickets, setAlltickets] = useState([])



const handleSubmit = async (e) => {
  e.preventDefault();

  // Show toast loader
  const loadingToast = toast.loading("Raising ticket...");

  try {
    const res = await axios.post(
      `${baseUrl}/ticket/create`,
      { title, description },
      { withCredentials: true }
    );

    const { data } = res;

    if (data?.success) {
      toast.success(data?.message || "Ticket raised successfully", { id: loadingToast });
      setTitle(""); // clear form
      setDescription(""); // clear form
    } else {
      toast.error(data?.message || "Something went wrong", { id: loadingToast });
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Server error", { id: loadingToast });
  }
};


  return (
    <div className="min-h-screen ">
      <Navbar setUser={setUser} user={user} />

      <div className="flex justify-center mt-10 px-4">
        <div className="w-full md:w-7/12  shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Create Ticket</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter ticket title"
                className="input  w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                placeholder="Enter ticket description"
                className="textarea  w-full outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* Submit button */}
            <div className="form-control w-full">
              <button type="submit" className="btn btn-primary w-full">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
