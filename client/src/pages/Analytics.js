import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "../components/Layout";

import OverviewCards from "../components/analytics/OverviewCards";
import SalesChart from "../components/analytics/SalesChart";
import PaymentChart from "../components/analytics/PaymentChart";
import TopProductsChart from "../components/analytics/TopProductsChart";
import ReturnAnalytics from "../components/analytics/ReturnAnalytics";
import InventoryInsights from "../components/analytics/InventoryInsights";
import TopCustomers from "../components/analytics/TopCustomers";
import ProfitChart from "../components/analytics/ProfitChart";

export default function Analytics() {
  const [data, setData] = useState(null);

  const [filter, setFilter] = useState("7days");

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  // =====================================
  // FETCH ANALYTICS
  // =====================================
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/reports/analytics?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="pb-10">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Analytics Dashboard
            </h2>

            <p className="text-slate-400 mt-2">
              Advanced business insights and performance tracking
            </p>
          </div>

          {/* FILTER */}
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-xl outline-none focus:border-amber-400 transition"
            >
              <option value="today">Today</option>

              <option value="7days">Last 7 Days</option>

              <option value="30days">Last 30 Days</option>

              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* ===================================== */}
        {/* OVERVIEW CARDS */}
        {/* ===================================== */}
        <OverviewCards data={data} />

        {/* ===================================== */}
        {/* SALES CHART */}
        {/* ===================================== */}
        <SalesChart data={data} filter={filter} />

        {/* ===================================== */}
        {/* PAYMENT + TOP PRODUCTS */}
        {/* ===================================== */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 mb-8">
          <PaymentChart data={data} />

          <TopProductsChart data={data} />
        </div>

        {/* ===================================== */}
        {/* RETURNS + INVENTORY */}
        {/* ===================================== */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 mb-8">
          <ReturnAnalytics data={data} />

          <InventoryInsights data={data} />
        </div>

        {/* ===================================== */}
        {/* CUSTOMERS + PROFIT */}
        {/* ===================================== */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 mb-8">
          <TopCustomers data={data} />

          <ProfitChart data={data} />
        </div>

        {/* ===================================== */}
        {/* FOOTER */}
        {/* ===================================== */}
        <div className="text-center mt-10">
          <p className="text-slate-500 text-sm">
            POS Analytics System • Real-time Business Intelligence
          </p>
        </div>
      </div>
    </Layout>
  );
}
