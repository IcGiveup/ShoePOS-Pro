import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCashRegister,
  FaBox,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const role = user.role || "cashier";

  const adminMenu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "POS",
      icon: <FaCashRegister />,
      path: "/pos",
    },
    {
      name: "Returns",
      path: "/returns",
    },
    {
      name: "Products",
      icon: <FaBox />,
      path: "/products",
    },
    {
      name: "Customers",
      icon: <FaUsers />,
      path: "/customers",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/analytics",
    },
  ];

const cashierMenu = [
  {
    name: "POS",
    icon: <FaCashRegister />,
    path: "/pos",
  },
  {
    name: "Customers",
    icon: <FaUsers />,
    path: "/customers",
  },
  {
    name: "Returns",
    path: "/returns",
  },
];

  const menu = role === "admin" ? adminMenu : cashierMenu;

  return (
    <div className="w-64 min-h-screen bg-black text-white p-5 hidden md:block">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-8 text-yellow-400">ShoePOS Pro</h1>

      {/* User Info */}
      <div className="bg-gray-900 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400">Logged in as</p>

        <h2 className="font-semibold">{user.name || "User"}</h2>

        <p className="text-xs text-yellow-400 uppercase mt-1">{role}</p>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menu.map((item, i) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-yellow-400 text-black font-semibold"
                  : "hover:bg-gray-800 text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
