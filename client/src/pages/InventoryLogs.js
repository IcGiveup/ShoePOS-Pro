import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function InventoryLogs() {
  const token = localStorage.getItem("token");

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/inventory/logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Inventory History
        </h1>

        <p className="text-slate-400 mb-8">
          Complete stock movement records
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-4 text-left">Date</th>
                <th className="py-4 text-left">Action</th>
                <th className="py-4 text-left">Quantity</th>
                <th className="py-4 text-left">Previous</th>
                <th className="py-4 text-left">New</th>
                <th className="py-4 text-left">Reason</th>
                <th className="py-4 text-left">User</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-slate-800"
                >
                  <td className="py-4">
                    {new Date(
                      log.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="py-4 uppercase">
                    {log.action}
                  </td>

                  <td className="py-4">
                    {log.quantity}
                  </td>

                  <td className="py-4">
                    {log.previousStock}
                  </td>

                  <td className="py-4">
                    {log.newStock}
                  </td>

                  <td className="py-4">
                    {log.reason}
                  </td>

                  <td className="py-4">
                    {log.createdBy?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}