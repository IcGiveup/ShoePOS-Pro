import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  RotateCcw,
  Package,
  Users,
  UserCog,
  BarChart3,
  LogOut,
} from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

const adminMenus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "POS",
    path: "/pos",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
  },
  {
    name: "Purchases",
    path: "/purchases",
    icon: ShoppingCart,
  },
  {
    name: "Suppliers",
    path: "/suppliers",
    icon: Users,
  },
  {
    name: "Users",
    path: "/users",
    icon: UserCog,
  },
  {
    name: "Returns",
    path: "/returns",
    icon: RotateCcw,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

  const cashierMenus = [
    {
      name: "POS",
      path: "/pos",
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Returns",
      path: "/returns",
      icon: RotateCcw,
    },
  ];

  const menus = user?.role === "admin" ? adminMenus : cashierMenus;

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6 hidden md:block">
        <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
          ShoePOS Pro
        </h1>

        <div className="bg-slate-800 rounded-2xl p-5 mb-10 border border-slate-700">
          <p className="text-slate-400 text-sm">Logged in as</p>

          <h2 className="text-2xl font-bold mt-2">{user?.name || "User"}</h2>

          <p className="text-amber-400 font-semibold mt-2 uppercase">
            {user?.role || "Cashier"}
          </p>
        </div>

        <nav className="space-y-3">
          {menus.map((menu, index) => {
            const Icon = menu.icon;

            return (
              <Link
                key={index}
                to={menu.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition text-lg"
              >
                <Icon className="w-5 h-5" />
                {menu.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-end items-center gap-4 mb-8">
          <div className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold uppercase">
            {user?.role || "Cashier"}
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
