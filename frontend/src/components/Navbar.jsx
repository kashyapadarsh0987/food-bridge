import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user || location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="flex items-center px-6 py-3 border-b border-gray-200 bg-white">
      <Link to="/donations" className="font-bold text-lg text-gray-800 mr-6">
        FoodBridge
      </Link>
      <Link to="/donations" className="text-gray-600 hover:text-gray-900 mr-6">
        Donations
      </Link>

      {user.role === "admin" && (
        <Link to="/admin" className="text-gray-600 hover:text-gray-900 mr-6">
          Admin Dashboard
        </Link>
      )}

      <span className="ml-auto text-gray-600 mr-4">
        Hi, {user.name} ({user.role})
      </span>
      <button
        onClick={handleLogout}
        className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-md"
      >
        Logout
      </button>
    </nav>
  );
}