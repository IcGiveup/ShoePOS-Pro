import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Inventory() {
  const token = localStorage.getItem("token");

  const [variants, setVariants] = useState([]);

  const [selected, setSelected] = useState(null);

  const [action, setAction] = useState("stock_in");

  const [quantity, setQuantity] = useState("");

  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVariants(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStock = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/inventory/${selected._id}`,
        {
          action,
          quantity,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Stock Updated");

      setSelected(null);

      fetchInventory();
    } catch (error) {
      alert(
        error.response?.data?.msg ||
          "Update Failed"
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Inventory Management
          </h1>

          <p className="text-slate-400">
            Manage product stock levels
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-auto">

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-4 text-left">Product</th>
                <th className="py-4 text-left">Size</th>
                <th className="py-4 text-left">Color</th>
                <th className="py-4 text-left">Stock</th>
                <th className="py-4 text-left">Status</th>
                <th className="py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {variants.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-800"
                >
                  <td className="py-4 text-white">
                    {item.productId?.name}
                  </td>

                  <td>{item.size}</td>

                  <td>{item.color}</td>

                  <td>
                    {Number(
                      item.stock || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    {item.stock === 0 ? (
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    ) : item.stock <= 5 ? (
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() =>
                        setSelected(item)
                      }
                      className="bg-amber-400 text-black px-4 py-2 rounded-lg font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* MODAL */}

        {selected && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg">

              <h2 className="text-2xl font-bold mb-6">
                Stock Adjustment
              </h2>

              <p className="mb-6 text-slate-400">
                {selected.productId?.name}
                <br />
                Size {selected.size} • {selected.color}
              </p>

              <div className="space-y-4">

                <select
                  value={action}
                  onChange={(e) =>
                    setAction(
                      e.target.value
                    )
                  }
                  className="w-full bg-slate-800 px-4 py-3 rounded-xl"
                >
                  <option value="stock_in">
                    Stock In
                  </option>

                  <option value="stock_out">
                    Stock Out
                  </option>

                  <option value="adjustment">
                    Set Exact Stock
                  </option>
                </select>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  placeholder="Quantity"
                  className="w-full bg-slate-800 px-4 py-3 rounded-xl"
                />

                <textarea
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                  placeholder="Reason"
                  rows="4"
                  className="w-full bg-slate-800 px-4 py-3 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="bg-slate-600 px-5 py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={updateStock}
                  className="bg-amber-400 text-black px-6 py-3 rounded-xl font-semibold"
                >
                  Save
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}