import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#facc15"];

export default function PaymentChart({ data }) {
  const paymentData = [
    {
      name: "Cash",
      value: data?.payments?.cash || 0,
    },

    {
      name: "Card",
      value: data?.payments?.card || 0,
    },

    {
      name: "Mobile",
      value: data?.payments?.mobile || 0,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">
        Payment Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={paymentData}
            dataKey="value"
            outerRadius={120}
            label={({ name, percent }) =>
  `${name} ${(percent * 100).toFixed(0)}%`
}
          >
            {paymentData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}