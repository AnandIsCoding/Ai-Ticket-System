import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate,useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    const loadingToast = toast.loading("Fetching ticket...");
    try {
      const res = await axios.get(`${baseUrl}/ticket/${id}`, {
        withCredentials: true,
      });
      setTicket(res.data.ticket);
      toast.success("Ticket fetched!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error fetching ticket", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-400 font-medium">
        Loading ticket...
      </p>
    );

  if (!ticket)
    return (
      <p className="text-center mt-10 text-red-400 font-medium">
        Ticket not found.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-4">{ticket.title}</h2>
        <p className="text-gray-300 mb-4">{ticket.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-700 p-4 rounded">
            <span className="text-gray-400 font-medium">Status:</span>{" "}
            <span className="text-white font-semibold">{ticket.status}</span>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <span className="text-gray-400 font-medium">Created At:</span>{" "}
            <span className="text-white">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
          {ticket.assignedTo && (
            <div className="bg-gray-700 p-4 rounded col-span-full">
              <span className="text-gray-400 font-medium">Assigned To:</span>{" "}
              <span className="text-white">{ticket.assignedTo.email}</span>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}

export default TicketDetails;
