export default function InventoryInsights({ data }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6">
        Inventory Insights
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm">
            Inventory Value
          </p>

          <h2 className="text-2xl font-bold text-emerald-400 mt-2">
            ৳
            {Number(
              data?.inventoryValue || 0
            ).toLocaleString()}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm">
            Total Variants
          </p>

          <h2 className="text-2xl font-bold text-white mt-2">
            {data?.totalInventoryItems || 0}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm">
            Low Stock
          </p>

          <h2 className="text-2xl font-bold text-yellow-400 mt-2">
            {data?.lowStockCount || 0}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-sm">
            Out Of Stock
          </p>

          <h2 className="text-2xl font-bold text-red-400 mt-2">
            {data?.outOfStock || 0}
          </h2>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-slate-300">
            Inventory Health
          </span>

          <span className="text-emerald-400 font-bold">
            {Math.max(
              0,
              100 -
                (
                  ((data?.outOfStock || 0) +
                    (data?.lowStockCount || 0)) /
                  Math.max(
                    data?.totalInventoryItems || 1,
                    1
                  )
                ) *
                  100
            ).toFixed(0)}
            %
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-4">
          <div
            className="bg-emerald-400 h-4 rounded-full"
            style={{
              width: `${Math.max(
                0,
                100 -
                  (
                    ((data?.outOfStock || 0) +
                      (data?.lowStockCount || 0)) /
                    Math.max(
                      data?.totalInventoryItems || 1,
                      1
                    )
                  ) *
                    100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}