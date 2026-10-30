import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SalesChart({
  data,
  filter,
}) {
  // =====================================
  // DYNAMIC TITLE
  // =====================================
  const getTitle = () => {
    switch (filter) {
      case "today":
        return "Today's sales performance";

      case "7days":
        return "Last 7 days sales performance";

      case "30days":
        return "Last 30 days sales performance";

      case "month":
        return "This month sales performance";

      default:
        return "Sales performance";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-white">
          Sales Overview
        </h3>

        <p className="text-slate-400 mt-2">
          {getTitle()}
        </p>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={data?.salesData || []}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="date"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#facc15"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#facc15",
            }}
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}