import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ foodType: "", quantity: "", description: "", pickupAddress: "", expiryTime: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  const loadDonations = async () => {
    try {
      const { data } = await api.get("/donations");
      setDonations(data);
    } catch (err) {
      setError("Failed to load donations");
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/donations", form);
      setForm({ foodType: "", quantity: "", description: "", pickupAddress: "", expiryTime: "" });
      loadDonations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create donation");
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (donationId) => {
    try {
      await api.post(`/requests/${donationId}`);
      alert("Request sent! The donor will review it.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const loadRequests = async (donationId) => {
    try {
      const { data } = await api.get(`/requests/donation/${donationId}`);
      setRequests({ ...requests, [donationId]: data });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load requests");
    }
  };

  const handleApprove = async (requestId, donationId) => {
    try {
      await api.patch(`/requests/${requestId}/approve`);
      alert("Request approved!");
      loadDonations();
      loadRequests(donationId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve request");
    }
  };

  const urgencyStyles = {
    Urgent: "bg-red-100 text-red-700",
    Moderate: "bg-orange-100 text-orange-700",
    Low: "bg-green-100 text-green-700",
  };

  const statusStyles = {
    available: "bg-blue-100 text-blue-700",
    claimed: "bg-gray-200 text-gray-700",
    completed: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">FoodBridge Donations</h1>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        {user?.role === "donor" && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-6 mb-8 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Post a New Donation</h2>
            <input
              type="text" name="foodType" placeholder="Food type (e.g. Rice, Biryani)"
              value={form.foodType} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text" name="quantity" placeholder="Quantity (e.g. 10 kg, 20 plates)"
              value={form.quantity} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text" name="pickupAddress" placeholder="Pickup address"
              value={form.pickupAddress} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              name="description" placeholder="Description (optional)"
              value={form.description} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <label className="block text-sm text-gray-600">
              Best before:
              <input
                type="datetime-local" name="expiryTime"
                value={form.expiryTime} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </label>
            <button
              type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium py-2 rounded-md transition"
            >
              {loading ? "Posting (AI is analyzing)..." : "Post Donation"}
            </button>
          </form>
        )}

        <h2 className="text-lg font-semibold text-gray-800 mb-3">All Donations</h2>
        {donations.length === 0 && <p className="text-gray-500">No donations posted yet.</p>}

        <div className="space-y-4">
          {donations.map((d) => (
            <div key={d._id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{d.foodType}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${urgencyStyles[d.urgency] || "bg-gray-100 text-gray-600"}`}>
                  {d.urgency}
                </span>
              </div>

              <p className="text-gray-600 text-sm">Quantity: {d.quantity}</p>
              {d.description && <p className="text-gray-600 text-sm">{d.description}</p>}
              {d.pickupAddress && <p className="text-gray-600 text-sm">📍 {d.pickupAddress}</p>}
              {d.estimatedMeals && <p className="text-gray-700 text-sm mt-1">🍽️ Estimated meals: {d.estimatedMeals}</p>}
              {d.safetyTip && <p className="text-gray-500 text-xs mt-1">💡 {d.safetyTip}</p>}
              {d.urgencyReason && <p className="text-gray-400 text-xs">{d.urgencyReason}</p>}

              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className="text-gray-500">
                  Best before: {new Date(d.expiryTime).toLocaleString()}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[d.status] || "bg-gray-100 text-gray-600"}`}>
                  {d.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Donor: {d.donor?.name}</p>

              {user?.role === "receiver" && d.status === "available" && (
                <button
                  onClick={() => handleRequest(d._id)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                >
                  Request this donation
                </button>
              )}

              {user?.role === "donor" && d.donor?._id === user.id && d.status === "available" && (
                <div className="mt-3">
                  <button
                    onClick={() => loadRequests(d._id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-md transition"
                  >
                    View Requests
                  </button>

                  {requests[d._id] && (
                    <div className="mt-3 pl-3 border-l-2 border-gray-200 space-y-2">
                      {requests[d._id].length === 0 && (
                        <p className="text-sm text-gray-400">No requests yet.</p>
                      )}
                      {requests[d._id].map((r) => (
                        <div key={r._id} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">
                            {r.receiver?.name} ({r.receiver?.email})
                          </span>
                          <button
                            onClick={() => handleApprove(r._id, d._id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition"
                          >
                            Approve
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}