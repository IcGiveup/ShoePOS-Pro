import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaUndo, FaSearch, FaExchangeAlt } from "react-icons/fa";

export default function Returns() {
  const [invoiceNo, setInvoiceNo] = useState("");

  const [sale, setSale] = useState(null);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const search = async () => {
    if (!invoiceNo) {
      return alert("Enter invoice number");
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/returns/search/${invoiceNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSale(res.data);
    } catch {
      alert("Invoice not found");
      setSale(null);
    } finally {
      setLoading(false);
    }
  };

  const processReturn = async (item) => {
    try {
      await axios.post(
        "http://localhost:5000/api/returns/return",
        {
          saleId: sale._id,
          invoiceNo: sale.invoiceNo,
          oldVariantId: item.variantId,
          qty: item.qty,
          refundAmount: item.lineTotal,
          reason: "Customer return",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Returned Successfully");

      navigate("/dashboard");
    } catch (error) {
      alert("Return failed");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Returns & Exchange
            </h1>

            <p className="text-slate-400 mt-1">
              Process product returns and exchanges
            </p>
          </div>

          <div className="bg-red-500/20 text-red-400 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2">
            <FaUndo />
            Return Module
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Search Invoice
          </h2>

          <div className="flex gap-3">
            <input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Enter invoice number"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder:text-slate-400 outline-none"
            />

            <button
              onClick={search}
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-300 text-black px-6 py-4 rounded-xl font-semibold flex items-center gap-2 transition"
            >
              <FaSearch />

              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Sale Details */}
        {sale && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            {/* Invoice Header */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Invoice #{sale.invoiceNo}
                </h2>

                <p className="text-slate-400 mt-1">
                  Customer: {sale.customerName || "Walk-in Customer"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-slate-400 text-sm">Total Amount</p>

                <h2 className="text-3xl font-bold text-amber-400">
                  ৳{sale.total}
                </h2>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {sale.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.productName}
                    </h3>

                    <p className="text-slate-400 mt-1">
                      Size {item.size} • {item.color}
                    </p>

                    <p className="text-slate-500 text-sm mt-1">
                      Quantity: {item.qty}
                    </p>
                  </div>

                  <button
                    onClick={() => processReturn(item)}
                    className="bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
                  >
                    <FaExchangeAlt />
                    Return
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
