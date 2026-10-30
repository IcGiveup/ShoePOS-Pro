import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#22c55e"];

export default function ReturnAnalytics({ data }) {
  const chartData = [
    {
      name: "Returns",
      value: data?.totalReturns || 0,
    },

    {
      name: "Successful Orders",
      value:
        (data?.totalOrders || 0) -
        (data?.totalReturns || 0),
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">
        Return Analytics
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            outerRadius={110}
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}