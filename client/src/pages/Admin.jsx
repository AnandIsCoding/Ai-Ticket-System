import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

const baseUrl = import.meta.env.VITE_BASE_URL;

function Admin({ user, setUser }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchTickets = async () => {
    const loadingToast = toast.loading("Fetching tickets...");
    try {
      const res = await axios.get(`${baseUrl}/ticket/allticket`, {
        withCredentials: true,
      });
      setTickets(res.data.tickets);
      toast.success("Tickets loaded!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error fetching tickets", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className={`min-h-screen bg-gray-900 pt-24 `}>
      <Navbar user={user} setUser={setUser} />

      <div className="max-w-6xl mx-auto py-10 px-4">
        {user?.role === "admin" && (
          <button
            onClick={() => navigate(`/admin/allusers`)}
            className="mb-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            See All Users
          </button>
        )}
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          All Tickets
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-400">No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setIsModalOpen(true);
                  }}
                >
                  <h2 className="text-xl font-bold text-white mb-2">
                    {ticket.title}
                  </h2>
                  <p className="text-gray-300 mb-2 line-clamp-3">
                    {ticket.description}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        ticket.status === "IN_PROGRESS"
                          ? "text-yellow-400"
                          : ticket.status === "Todo"
                          ? "text-blue-400"
                          : "text-green-400"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTicket && (
        <dialog
          id="adminTicketModal"
          className={`modal ${isModalOpen ? "modal-open" : ""}`}
        >
          <div className="modal-box max-w-2xl bg-gray-300 text-black">
            <h3 className="font-bold text-2xl mb-4">{selectedTicket.title}</h3>

            <p className="mb-3">
              <span className="font-semibold">Description:</span>
              <br />
              {selectedTicket.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedTicket.status}
              </p>
              <p>
                <span className="font-semibold">Priority:</span>{" "}
                {selectedTicket.priority}
              </p>
              <p>
                <span className="font-semibold">Assigned To:</span>{" "}
                {selectedTicket?.assignedTo?.email || "Unassigned"}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedTicket.createdAt).toLocaleString()}
              </p>
            </div>

            {selectedTicket.helpfulNotes && (
              <div className="mt-4">
                <span className="font-semibold">Helpful Notes:</span>
                <p className="text-black">{selectedTicket.helpfulNotes}</p>
              </div>
            )}

            {selectedTicket.relatedSkills?.length > 0 && (
              <div className="mt-4">
                <span className="font-semibold">Related Skills:</span>
                <ul className="list-disc list-inside text-black">
                  {selectedTicket.relatedSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTicket(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Admin;
