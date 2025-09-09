import axios from "axios";
import React, { useEffect,useState } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useLogoutHandler } from "../utils/logoutHandler";

const baseUrl = import.meta.env.VITE_BASE_URL;

function Dashboard({ setUser, user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [allTickets, setAllTickets] = useState([]);
  const navigate = useNavigate()

  // 🔹 Fetch tickets of logged-in user
  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${baseUrl}/ticket/allticket`, {
        withCredentials: true,
      });
      const { data } = res;
      if (data?.tickets) {
        setAllTickets(data.tickets);
      } else {
        toast.error(data?.message || "No tickets found", { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Server error", {
        id: loadingToast,
      });
    }
  };

  // 🔹 Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // 🔹 Create ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Raising ticket...");

    try {
      const res = await axios.post(
        `${baseUrl}/ticket/create`,
        { title, description },
        { withCredentials: true }
      );

      const { data } = res;

      if (data?.success) {
        toast.success(data?.message || "Ticket raised successfully", {
          id: loadingToast,
        });
        setTitle("");
        setDescription("");
        // refetch tickets after creation
        fetchTickets();
      } else {
        toast.error(data?.message || "Something went wrong", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Server error", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar setUser={setUser} user={user} />

      {/* Create Ticket Form */}
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full md:w-7/12 shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Create Ticket
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter ticket title"
                className="input w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                placeholder="Enter ticket description"
                className="textarea w-full outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="form-control w-full">
              <button type="submit" className="btn btn-primary w-full">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Display Tickets */}
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full md:w-7/12 shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            My Tickets
          </h2>
          {allTickets.length === 0 ? (
            <p className="text-center text-gray-300">No tickets found.</p>
          ) : (
            <ul className="space-y-4">
              {allTickets.map((ticket) => (
                <li
                  onClick={()=>navigate(`/dashboard/ticket/${ticket._id}`)}
                  key={ticket._id}
                  className="p-4 bg-gray-800 cursor-pointer rounded-md shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {ticket.title}
                  </h3>
                  <p className="text-gray-300">{ticket.description}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Status: <span className="font-medium">{ticket.status}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
