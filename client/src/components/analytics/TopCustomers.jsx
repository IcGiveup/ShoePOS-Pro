export default function TopCustomers({ data }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Top Customers
          </h3>

          <p className="text-slate-400 mt-1 text-sm">
            Highest spending customers
          </p>
        </div>

        <div className="bg-amber-400/10 text-amber-400 px-3 py-1 rounded-lg text-sm font-semibold">
          Top 5
        </div>
      </div>

      {/* EMPTY STATE */}
      {!data?.topCustomers ||
      data.topCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">
            👥
          </div>

          <h3 className="text-xl font-bold text-white">
            No Customer Data
          </h3>

          <p className="text-slate-400 mt-2">
            Customer analytics will appear here
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left pb-4 text-slate-400 font-medium">
                  Customer
                </th>

                <th className="text-left pb-4 text-slate-400 font-medium">
                  Orders
                </th>

                <th className="text-right pb-4 text-slate-400 font-medium">
                  Total Spent
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.topCustomers?.map(
                (customer, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                  >
                    {/* CUSTOMER */}
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        {/* AVATAR */}
                        <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                          {customer.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>
                          <p className="text-white font-medium">
                            {customer.name}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            {/* RANK BADGE */}
                            {index === 0 && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md">
                                🥇 Top Buyer
                              </span>
                            )}

                            {index === 1 && (
                              <span className="text-xs bg-slate-500/20 text-slate-300 px-2 py-1 rounded-md">
                                🥈 Second
                              </span>
                            )}

                            {index === 2 && (
                              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md">
                                🥉 Third
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ORDERS */}
                    <td className="py-5">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-semibold">
                        {customer.orders}
                      </div>
                    </td>

                    {/* TOTAL SPENT */}
                    <td className="py-5 text-right">
                      <span className="text-green-400 font-bold text-lg">
                        ৳
                        {Number(
                          customer.totalSpent || 0
                        ).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}