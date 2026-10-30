export default function Navbar() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Left */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Welcome, {user.name || "User"}
        </h2>

        <p className="text-sm text-gray-500">
          Manage your store efficiently
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700">
          Role: {user.role || "Admin"}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}