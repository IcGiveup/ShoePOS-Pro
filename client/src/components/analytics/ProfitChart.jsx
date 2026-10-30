import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProfitChart({ data }) {
  const chartData = [
    {
      name: "Revenue",
      value: data?.monthlyRevenue || 0,
    },

    {
      name: "Profit",
      value: data?.estimatedProfit || 0,
    },

    {
      name: "Discount",
      value: data?.totalDiscount || 0,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">
        Financial Analytics
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#22c55e"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}