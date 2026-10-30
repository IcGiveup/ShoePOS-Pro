import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  AlertTriangle,
  Star,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

export default function Dashboard() {
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/reports/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      title: "Today Sales",
      value: `৳${Number(
        data?.todaySales?.total || 0
      ).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Today's Orders",
      value: data?.todaySales?.count || 0,
      icon: ShoppingCart,
    },
    {
      title: "Low Stock",
      value: data?.lowStock?.length || 0,
      icon: AlertTriangle,
    },
    {
      title: "Top Product",
      value: data?.topProduct || "N/A",
      icon: Star,
    },
  ];

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white">
            Dashboard
          </h2>

          <p className="text-slate-400 mt-2">
            Quick business overview
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5"
              >
                <div className="flex justify-between">
                  <p className="text-slate-400">
                    {card.title}
                  </p>

                  <Icon className="w-5 h-5 text-amber-400" />
                </div>

                <p className="text-2xl font-bold mt-4 text-white">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Recent Sales */}
          <section className="xl:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Recent Sales
            </h3>

            <div className="space-y-3">
              {(data?.recentSales || []).map(
                (sale, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-slate-800 rounded-xl p-3"
                  >
                    <span className="text-white">
                      {sale.invoiceNo}
                    </span>

                    <span className="text-white">
                      ৳
                      {Number(
                        sale.total || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Low Stock */}
          <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Low Stock
              </h3>

              <button
                onClick={() => navigate("/products")}
                className="text-sm bg-amber-400 hover:bg-amber-500 text-black font-semibold px-3 py-1 rounded-lg transition"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {(data?.lowStock || [])
                .slice(0, 5)
                .map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate("/products")}
                    className="bg-slate-800 rounded-xl p-3 text-sm text-white cursor-pointer hover:bg-slate-700 transition"
                  >
                    {item.productId?.name} - Size{" "}
                    {item.size}
                    <span className="text-red-400 ml-2">
                      ({item.stock})
                    </span>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}