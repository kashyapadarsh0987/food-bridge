import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Admin() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.role !== "admin") return navigate("/donations");
  }, []);

  const loadPending = async () => {
    try {
      const { data } = await api.get("/admin/unverified");
      setPending(data);
    } catch (err) {
      setError("Failed to load pending receivers");
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/verify/${id}`);
      loadPending();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        <h2 className="text-lg font-semibold text-gray-800 mb-3">Pending Receiver Approvals</h2>

        {pending.length === 0 && (
          <p className="text-gray-500 bg-white rounded-xl shadow-sm p-5">No pending approvals right now.</p>
        )}

        <div className="space-y-3">
          {pending.map((u) => (
            <div key={u._id} className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <button
                onClick={() => handleApprove(u._id)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}