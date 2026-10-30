import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/pos");
      }
    }
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/pos");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="grid md:grid-cols-2 w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-yellow-400 to-amber-500 text-black">
          <h1 className="text-5xl font-bold mb-4">
            ShoePOS Pro
          </h1>

          <p className="text-lg font-medium opacity-90">
            Smart POS & Inventory System for Modern Shoe Stores.
          </p>

          <div className="mt-10 space-y-4 text-sm">
            <p>✔ Product Matrix</p>
            <p>✔ Barcode Scanner</p>
            <p>✔ Loyalty Points</p>
            <p>✔ Analytics Reports</p>
            <p>✔ Multi Payment</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-8">
            Login to continue
          </p>

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={login} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Secure login for Admin & Cashier
          </p>
        </div>
      </div>
    </div>
  );
}