import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaUndo,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function OverviewCards({ data }) {
const cards = [
  {
    title: "Monthly Revenue",
    value: `৳${Number(
      data?.monthlyRevenue || 0
    ).toLocaleString()}`,
    color: "text-amber-400",
    icon: <FaMoneyBillWave />,
  },

  {
    title: "Total Orders",
    value: data?.totalOrders || 0,
    color: "text-white",
    icon: <FaShoppingCart />,
  },

  {
    title: "Inventory Value",
    value: `৳${Number(
      data?.inventoryValue || 0
    ).toLocaleString()}`,
    color: "text-emerald-400",
    icon: <FaMoneyBillWave />,
  },

  {
    title: "Out Of Stock",
    value: data?.outOfStock || 0,
    color: "text-red-400",
    icon: <FaExclamationTriangle />,
  },

  {
    title: "Returned Products",
    value: data?.totalReturns || 0,
    color: "text-orange-400",
    icon: <FaUndo />,
  },

  {
    title: "Low Stock",
    value: data?.lowStockCount || 0,
    color: "text-yellow-400",
    icon: <FaExclamationTriangle />,
  },
];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                {card.title}
              </p>

              <h2
                className={`text-3xl font-bold mt-3 ${card.color}`}
              >
                {card.value}
              </h2>
            </div>

            <div className="text-3xl text-slate-500">
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}