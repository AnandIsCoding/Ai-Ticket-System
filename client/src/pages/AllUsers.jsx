import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

const baseUrl = import.meta.env.VITE_BASE_URL;

function AllUsers({ user, setUser }) {
  const navigate = useNavigate(); // router navigate
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ role: "", skills: "" });

  // Fetch all users
  const fetchUsers = async () => {
    const loadingToast = toast.loading("Fetching users...");
    try {
      const res = await axios.get(`${baseUrl}/admin/allusers`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
      toast.success("Users loaded !", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error fetching users", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by role
  const displayedUsers =
    filteredRole === "all"
      ? users
      : users.filter((u) => u.role === filteredRole);

  const startEditing = (u) => {
    setEditingId(u._id.$oid || u._id);
    setEditData({
      role: u.role,
      skills: u.skills.join(", "),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ role: "", skills: "" });
  };

  const saveUser = async (u) => {
    const loadingToast = toast.loading("Updating user...");
    try {
      const res = await axios.post(
        `${baseUrl}/admin/update-users`,
        {
          email: u.email,
          role: editData.role,
          skills: editData.skills.split(",").map((s) => s.trim()),
        },
        { withCredentials: true }
      );

      const updatedUser = res.data.user;
      setUsers((prev) =>
        prev.map((user) =>
          (user._id.$oid || user._id) === (u._id.$oid || u._id)
            ? updatedUser
            : user
        )
      );
      toast.success("User updated successfully!", { id: loadingToast });
      cancelEditing();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error updating user", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar user={user} setUser={setUser} />

      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          All Users
        </h1>

        {/* Filter Dropdown */}
        <div className="flex justify-end mb-6">
          <select
            value={filteredRole}
            onChange={(e) => setFilteredRole(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading users...</p>
        ) : displayedUsers.length === 0 ? (
          <p className="text-center text-gray-400">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedUsers.map((u) => {
              const uid = u._id.$oid || u._id;
              const isEditing = editingId === uid;
              return (
                <div
                  key={uid}
                  className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center mb-4 justify-between">
                    <div className="flex items-center">
                      <img
                        src={u.profilePic}
                        alt={u.fullName}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          {u.fullName}
                        </h2>
                        <p className="text-gray-400 text-sm">{u.email}</p>
                      </div>
                    </div>

                    {/* Edit / Save / Cancel buttons */}
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveUser(u)}
                          className="text-green-400 hover:text-green-600"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(u)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>

                  {/* Editable fields */}
                  <div className="mb-2">
                    <p className="text-gray-300 mb-1">Role:</p>
                    {isEditing ? (
                      <select
                        value={editData.role}
                        onChange={(e) =>
                          setEditData({ ...editData, role: e.target.value })
                        }
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`font-semibold ${
                          u.role === "admin"
                            ? "text-red-400"
                            : u.role === "moderator"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="text-gray-300 mb-1">Skills:</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.skills}
                        onChange={(e) =>
                          setEditData({ ...editData, skills: e.target.value })
                        }
                        placeholder="Comma separated skills"
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <p className="text-gray-400 text-sm">
                        {u.skills.join(", ") || "No skills"}
                      </p>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mt-2">
                    Joined:{" "}
                    {new Date(
                      u.createdAt.$date || u.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllUsers;
