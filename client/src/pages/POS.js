import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function POS() {
  const navigate = useNavigate();

  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);

  const [customerPhone, setCustomerPhone] = useState("");

  const [customer, setCustomer] = useState(null);

  const [cash, setCash] = useState("");
  const [card, setCard] = useState("");
  const [mobile, setMobile] = useState("");

  // DISCOUNT %
  const [discount, setDiscount] = useState("");

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // =========================
  // DIGIT GROUPING
  // =========================
  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // =========================
  // SEARCH CUSTOMER
  // =========================
  const searchCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/customers/search/${customerPhone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomer(res.data);
    } catch (error) {
      alert("Customer not found");
      setCustomer(null);
    }
  };

  const createCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/customers",
        newCustomer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Customer Created");

      // Auto Select Customer
      setCustomer(res.data);

      setCustomerPhone(res.data.phone);

      setShowCustomerModal(false);

      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (error) {
      alert(error.response?.data?.msg || error.message);
    }
  };

  // =========================
  // ADD PRODUCT
  // =========================
  const addProduct = async () => {
    if (!barcode) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/pos/scan/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const item = res.data;

      const existing = cart.find((c) => c.variantId === item._id);

      if (existing) {
        setCart((prev) =>
          prev.map((c) =>
            c.variantId === item._id
              ? {
                  ...c,
                  qty: c.qty + 1,
                }
              : c,
          ),
        );
      } else {
        setCart((prev) => [
          ...prev,
          {
            variantId: item._id,
            productName: item.productId?.name,
            size: item.size,
            color: item.color,
            qty: 1,
            price: item.price,
          },
        ]);
      }

      setBarcode("");
    } catch (error) {
      alert("Product not found");
    }
  };

  // =========================
  // UPDATE QTY
  // =========================
  const updateQty = (id, type) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.variantId !== id) return item;

        if (type === "minus" && item.qty > 1) {
          return {
            ...item,
            qty: item.qty - 1,
          };
        }

        if (type === "plus") {
          return {
            ...item,
            qty: item.qty + 1,
          };
        }

        return item;
      }),
    );
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.variantId !== id));
  };

  // =========================
  // CALCULATIONS
  // =========================
  const subTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  // DISCOUNT %
  const discountAmount = useMemo(() => {
    return (subTotal * Number(discount || 0)) / 100;
  }, [subTotal, discount]);

  const vat = 0;

  const total = subTotal - discountAmount + vat;

  const paid = Number(cash || 0) + Number(card || 0) + Number(mobile || 0);

  const change = paid - total;

  // =========================
  // CHECKOUT
  // =========================
  const checkout = async () => {
    try {
      if (cart.length === 0) {
        return alert("Cart is empty");
      }

      if (paid < total) {
        return alert("Insufficient payment");
      }

      const token = localStorage.getItem("token");

      const payload = {
        customerId: customer?._id || null,

        items: cart.map((item) => ({
          variantId: item.variantId,
          productName: item.productName,
          size: item.size,
          color: item.color,
          qty: item.qty,
          price: item.price,
          lineTotal: item.price * item.qty,
        })),

        discount: Number(discount || 0),

        vat,

        payments: {
          cash: Number(cash) || 0,
          card: Number(card) || 0,
          mobile: Number(mobile) || 0,
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/pos/checkout",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Sale completed");

      navigate("/invoice", {
        state: {
          sale: res.data.sale,
        },
      });

      // RESET
      setCart([]);
      setCustomer(null);
      setCustomerPhone("");
      setCash("");
      setCard("");
      setMobile("");
      setDiscount("");
    } catch (error) {
      alert(error.response?.data?.msg || "Checkout failed");
    }
  };

  return (
    <Layout>
      <div className="grid xl:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          {/* HEADER */}
          <div>
            <h1 className="text-5xl font-bold text-white">POS Terminal</h1>

            <p className="text-slate-400 mt-2">
              Manage customer sales efficiently
            </p>
          </div>

          {/* CUSTOMER */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Customer</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Customer phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none"
              />

              <button
                onClick={searchCustomer}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 rounded-2xl"
              >
                Search
              </button>

              <button
                onClick={() => setShowCustomerModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 rounded-2xl"
              >
                + Add Customer
              </button>
            </div>

            {customer && (
              <div className="mt-5 bg-emerald-950 border border-emerald-700 rounded-2xl p-5">
                <h3 className="text-3xl font-bold text-white">
                  {customer.name}
                </h3>

                <p className="text-slate-300">{customer.phone}</p>

                <p className="text-slate-300">{customer.email}</p>

                <p className="text-yellow-400 font-bold mt-3">
                  Points: {customer.points}
                </p>
              </div>
            )}
          </div>

          {/* SCAN */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Scan Product</h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Scan barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none"
              />

              <button
                onClick={addProduct}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 rounded-2xl"
              >
                Add
              </button>
            </div>

            {/* CART */}
            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-slate-800 rounded-3xl p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {item.productName}
                    </h3>

                    <p className="text-slate-400">
                      Size: {item.size} • {item.color}
                    </p>

                    <p className="text-yellow-400 text-3xl font-bold mt-3">
                      ৳{formatMoney(item.price)}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => updateQty(item.variantId, "minus")}
                        className="w-10 h-10 rounded-xl bg-slate-700 text-white"
                      >
                        -
                      </button>

                      <span className="text-white font-bold">{item.qty}</span>

                      <button
                        onClick={() => updateQty(item.variantId, "plus")}
                        className="w-10 h-10 rounded-xl bg-slate-700 text-white"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-yellow-400 text-3xl font-bold mt-4">
                      ৳{formatMoney(item.qty * item.price)}
                    </p>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-red-400 mt-3"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit sticky top-5">
          <h2 className="text-5xl font-bold text-white mb-8">Checkout</h2>

          <div className="space-y-5">
            <input
              type="number"
              placeholder="Cash"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none"
            />

            <input
              type="number"
              placeholder="Card"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none"
            />

            <input
              type="number"
              placeholder="Mobile Banking"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none"
            />

            <input
              type="number"
              placeholder="Discount %"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none"
            />
          </div>

          {/* SUMMARY */}
          <div className="mt-8 border-t border-slate-700 pt-6 space-y-4">
            <div className="flex justify-between text-xl">
              <span className="text-slate-300">Subtotal</span>

              <span className="text-white">৳{formatMoney(subTotal)}</span>
            </div>

            <div className="flex justify-between text-xl">
              <span className="text-slate-300">Discount</span>

              <span className="text-white">
                {discount || 0}% (৳
                {formatMoney(discountAmount)})
              </span>
            </div>

            <div className="flex justify-between text-xl">
              <span className="text-slate-300">VAT</span>

              <span className="text-white">৳{formatMoney(vat)}</span>
            </div>

            <div className="border-t border-slate-700 pt-5 flex justify-between items-center">
              <span className="text-4xl font-bold text-white">Total</span>

              <span className="text-4xl font-bold text-yellow-400">
                ৳{formatMoney(total)}
              </span>
            </div>

            <div className="flex justify-between text-xl">
              <span className="text-slate-300">Paid</span>

              <span className="text-white">৳{formatMoney(paid)}</span>
            </div>

            <div className="flex justify-between text-xl">
              <span className="text-emerald-400 font-bold">Change</span>

              <span className="text-emerald-400 font-bold">
                ৳{formatMoney(change > 0 ? change : 0)}
              </span>
            </div>
          </div>

          <button
            onClick={checkout}
            className="w-full mt-8 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-5 rounded-2xl text-2xl"
          >
            Complete Sale
          </button>
        </div>
      </div>
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Add Customer</h2>

            <div className="space-y-4">
              <input
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    name: e.target.value,
                  })
                }
                className="w-full bg-slate-800 px-4 py-3 rounded-xl"
              />

              <input
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    phone: e.target.value,
                  })
                }
                className="w-full bg-slate-800 px-4 py-3 rounded-xl"
              />

              <input
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    email: e.target.value,
                  })
                }
                className="w-full bg-slate-800 px-4 py-3 rounded-xl"
              />

              <textarea
                rows="3"
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    address: e.target.value,
                  })
                }
                className="w-full bg-slate-800 px-4 py-3 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="bg-slate-600 px-5 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={createCustomer}
                className="bg-green-500 px-6 py-3 rounded-xl font-semibold"
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
