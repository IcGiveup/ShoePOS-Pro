import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Invoice() {
  const location = useLocation();

  const navigate = useNavigate();

  const printRef = useRef();

  const [sale, setSale] = useState(null);

  useEffect(() => {
    if (location.state?.sale) {
      setSale(location.state.sale);
    }
  }, [location]);

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-US");
  };

  const printInvoice = () => {
    window.print();
  };

  if (!sale) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        No invoice data found
      </div>
    );
  }

  return (
    <>
      {/* PRINT STYLE */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
            }

            .no-print {
              display: none !important;
            }

            .print-container {
              box-shadow: none !important;
              margin: 0 !important;
              width: 100% !important;
              border: none !important;
            }

            @page {
              size: A4;
              margin: 10mm;
            }
          }
        `}
      </style>

      <div className="min-h-screen bg-[#020617] py-10 px-4">
        <div
          ref={printRef}
          className="print-container max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-300"
        >
          {/* HEADER */}
          <div className="px-10 py-8 border-b border-slate-300 flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold text-amber-600">
                ShoePOS Pro
              </h1>

              <p className="text-slate-500 mt-2">
                Premium POS & Inventory System
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-bold text-slate-800">
                INVOICE
              </h2>

              <p className="text-slate-500 mt-2">
                {sale.invoiceNo}
              </p>

              <div className="mt-3 inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                Completed
              </div>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="grid grid-cols-2 gap-8 px-10 py-6 border-b border-slate-300">
            <div>
              <p className="text-slate-500 text-sm mb-1">
                Customer
              </p>

              <h3 className="text-xl font-bold text-slate-800">
                {sale.customerId?.name || "Walk-in Customer"}
              </h3>

              {sale.customerId?.phone && (
                <p className="text-slate-600 mt-1">
                  {sale.customerId.phone}
                </p>
              )}

              {sale.customerId?.email && (
                <p className="text-slate-600">
                  {sale.customerId.email}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-slate-500 text-sm mb-1">
                Date
              </p>

              <h3 className="text-lg font-semibold text-slate-800">
                {new Date(sale.createdAt).toLocaleDateString()}
              </h3>

              <p className="text-slate-500 mt-2 text-sm">
                Payment Status
              </p>

              <p className="text-green-600 font-semibold">
                Paid
              </p>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="px-10 py-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-5">
              Products
            </h2>

            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500">
                  <th className="text-left py-3">
                    Product
                  </th>

                  <th className="text-center py-3">
                    Qty
                  </th>

                  <th className="text-right py-3">
                    Price
                  </th>

                  <th className="text-right py-3">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {sale.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-200"
                  >
                    <td className="py-4">
                      <h3 className="font-semibold text-slate-800">
                        {item.productName}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Size: {item.size} • Color: {item.color}
                      </p>
                    </td>

                    <td className="text-center text-slate-700">
                      {item.qty}
                    </td>

                    <td className="text-right text-slate-700">
                      ৳{formatMoney(item.price)}
                    </td>

                    <td className="text-right font-semibold text-amber-600">
                      ৳{formatMoney(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS + PAYMENTS */}
          <div className="grid grid-cols-2 gap-10 px-10 py-6 border-t border-slate-300">
            {/* PAYMENT */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Payment Details
              </h3>

              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span>Cash</span>

                  <span className="font-semibold text-green-600">
                    ৳{formatMoney(sale.payments?.cash)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Card</span>

                  <span className="font-semibold text-blue-600">
                    ৳{formatMoney(sale.payments?.card)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Mobile Banking</span>

                  <span className="font-semibold text-amber-600">
                    ৳{formatMoney(sale.payments?.mobile)}
                  </span>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div>
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>

                  <span>
                    ৳{formatMoney(sale.subTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Discount</span>

                  <span>
                    ৳{formatMoney(sale.discount)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>VAT</span>

                  <span>
                    ৳{formatMoney(sale.vat)}
                  </span>
                </div>

                <div className="border-t border-slate-300 pt-4 flex justify-between items-center">
                  <span className="text-3xl font-bold text-slate-800">
                    Total
                  </span>

                  <span className="text-4xl font-bold text-amber-600">
                    ৳{formatMoney(sale.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-10 py-6 border-t border-slate-300 flex justify-between items-center no-print">
            <button
              onClick={printInvoice}
              className="bg-black hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Print Invoice
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}