import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    email: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const [historyOpen, setHistoryOpen] = useState(false);

  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/suppliers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuppliers(res.data);
    } catch (error) {
      console.log("FULL ERROR:", error);

      console.log("URL:", error.config?.url);

      console.log("STATUS:", error.response?.status);

      console.log("DATA:", error.response?.data);

      alert(JSON.stringify(error.response?.data || error.message));
    }
  };

  const addSupplier = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/suppliers", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        name: "",
        phone: "",
        company: "",
        email: "",
        address: "",
        notes: "",
      });

      fetchSuppliers();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.msg || error.message);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.company.toLowerCase().includes(search.toLowerCase()),
  );

  const showHistory = async (supplier) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/suppliers/${supplier._id}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSelectedSupplier(supplier);

      setPurchaseHistory(res.data);

      setHistoryOpen(true);
    } catch (error) {
      alert(error.response?.data?.msg || error.message);
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/suppliers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchSuppliers();
    } catch (error) {
      alert(error.response?.data?.msg || error.message);
    }
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white">Suppliers</h2>

          <p className="text-slate-400 mt-2">
            Manage suppliers and purchase partners
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Total Suppliers</p>

            <h2 className="text-4xl font-bold text-amber-400 mt-2">
              {suppliers.length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Registered Companies</p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {suppliers.filter((s) => s.company).length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Active Vendors</p>

            <h2 className="text-4xl font-bold text-blue-400 mt-2">
              {suppliers.length}
            </h2>
          </div>
        </div>

        {/* Add Supplier */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-6">Add New Supplier</h3>

          <form onSubmit={addSupplier} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Supplier Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="bg-slate-800 px-4 py-3 rounded-xl"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="bg-slate-800 px-4 py-3 rounded-xl"
              />

              <input
                placeholder="Company"
                value={form.company}
                onChange={(e) =>
                  setForm({
                    ...form,
                    company: e.target.value,
                  })
                }
                className="bg-slate-800 px-4 py-3 rounded-xl"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="bg-slate-800 px-4 py-3 rounded-xl"
              />
            </div>

            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="w-full bg-slate-800 px-4 py-3 rounded-xl"
            />

            <textarea
              rows="3"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
              className="w-full bg-slate-800 px-4 py-3 rounded-xl"
            />

            <button className="bg-amber-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-amber-500 transition">
              Add Supplier
            </button>
          </form>
        </div>

        {/* Supplier List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Supplier List</h3>

            <input
              type="text"
              placeholder="Search supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 px-4 py-2 rounded-xl"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-3 text-left">Name</th>
                  <th className="text-left">Company</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">Email</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="border-b border-slate-800 hover:bg-slate-800"
                  >
                    <td className="py-4">{supplier.name}</td>

                    <td>{supplier.company}</td>

                    <td>{supplier.phone}</td>

                    <td>{supplier.email}</td>
                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => showHistory(supplier)}
                          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                        >
                          History
                        </button>

                        <button
                          onClick={() => deleteSupplier(supplier._id)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {historyOpen && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl p-8 max-h-[80vh] overflow-auto">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-3xl font-bold">
            Supplier Purchase History
          </h2>

          <p className="text-slate-400">
            {
              selectedSupplier?.name
            }
          </p>
        </div>

        <button
          onClick={() =>
            setHistoryOpen(false)
          }
          className="bg-red-500 px-5 py-2 rounded-xl"
        >
          Close
        </button>

      </div>

      {purchaseHistory.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          No purchase records found.
        </div>
      ) : (
        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-700">

              <th className="py-3 text-left">
                GRN No
              </th>

              <th className="text-left">
                Date
              </th>

              <th className="text-left">
                Items
              </th>

              <th className="text-right">
                Total Cost
              </th>

            </tr>
          </thead>

          <tbody>

            {purchaseHistory.map(
              (purchase) => (
                <tr
                  key={
                    purchase._id
                  }
                  className="border-b border-slate-800"
                >

                  <td className="py-4">
                    {
                      purchase.grnNo
                    }
                  </td>

                  <td>
                    {new Date(
                      purchase.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {
                      purchase.items
                        ?.length
                    }
                  </td>

                  <td className="text-right text-green-400 font-semibold">
                    ৳
                    {Number(
                      purchase.totalCost ||
                        0
                    ).toLocaleString()}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>
      )}

    </div>

  </div>
)}
    </Layout>
  );
}
