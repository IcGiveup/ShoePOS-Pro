import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Purchases() {
  const token = localStorage.getItem("token");

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [supplierId, setSupplierId] = useState("");

  const [selectedVariant, setSelectedVariant] = useState("");

  const [qty, setQty] = useState("");

  const [costPrice, setCostPrice] = useState("");

  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchPurchases();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/suppliers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuppliers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchases", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchases(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addItem = () => {
    const variant = products
      .flatMap((p) => p.variants || [])
      .find((v) => v._id === selectedVariant);

    if (!variant) {
      alert("Select variant");
      return;
    }

    if (!qty || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    if (!costPrice || costPrice <= 0) {
      alert("Invalid cost price");
      return;
    }

    cart.push({
      variantId: variant._id,
      productName:
        products.find((p) => p._id === variant.productId)?.name || "",
      size: variant.size,
      color: variant.color,
      qty: Number(qty),
      costPrice: Number(costPrice),
      lineTotal: Number(qty) * Number(costPrice),
    });

    setCart([...cart]);

    setSelectedVariant("");
    setQty("");
    setCostPrice("");
  };

  const createPurchase = async () => {
    try {
      if (!supplierId) {
        alert("Select supplier");
        return;
      }

      if (cart.length === 0) {
        alert("No items");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/purchases",
        {
          supplierId,
          items: cart,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("GRN Created");

      setCart([]);

      fetchPurchases();
      fetchProducts();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.msg || "Failed");
    }
  };

  const totalCost = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-white">Purchase Management</h1>

        {/* CREATE GRN */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl text-white mb-4">Create GRN</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl text-white"
            >
              <option value="">Select Supplier</option>

              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl text-white"
            >
              <option value="">Select Variant</option>

              {products.map((product) =>
                (product.variants || []).map((variant) => (
                  <option key={variant._id} value={variant._id}>
                    {product.name}
                    {" | "}
                    Size {variant.size}
                    {" | "}
                    {variant.color}
                  </option>
                )),
              )}
            </select>

            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl text-white"
            />

            <input
              type="number"
              min="1"
              placeholder="Cost Price"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl text-white"
            />
          </div>

          <button
            onClick={addItem}
            className="mt-4 bg-blue-500 px-5 py-3 rounded-xl"
          >
            Add Item
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Purchase Items</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-4 text-left">Product</th>

                  <th className="py-4 text-center">Size</th>

                  <th className="py-4 text-center">Color</th>

                  <th className="py-4 text-center">Qty</th>

                  <th className="py-4 text-right">Cost Price</th>

                  <th className="py-4 text-right">Total</th>

                  <th className="py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/40"
                  >
                    <td className="py-4 font-medium">{item.productName}</td>

                    <td className="text-center">{item.size}</td>

                    <td className="text-center">{item.color}</td>

                    <td className="text-center">{item.qty}</td>

                    <td className="text-right font-semibold">
                      ৳{item.costPrice.toLocaleString()}
                    </td>

                    <td className="text-right font-semibold text-amber-400">
                      ৳{item.lineTotal.toLocaleString()}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() =>
                          setCart(cart.filter((_, i) => i !== index))
                        }
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t border-slate-700 pt-5 flex justify-between items-center">
            <div>
              <p className="text-slate-400">Total Items: {cart.length}</p>

              <h2 className="text-3xl font-bold text-amber-400">
                Total Cost: ৳{totalCost.toLocaleString()}
              </h2>
            </div>

            <button
              onClick={createPurchase}
              className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-xl font-bold text-lg"
            >
              Generate GRN
            </button>
          </div>
        </div>

        {/* HISTORY */}
        {/* HISTORY */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Purchase History
          </h2>

          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase._id} className="bg-slate-800 rounded-2xl p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {purchase.grnNo}
                    </h3>

                    <p className="text-slate-400">
                      Supplier: {purchase?.supplierId?.name}
                    </p>

                    <p className="text-slate-500 text-sm">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-amber-400 font-bold text-xl">
                      ৳{Number(purchase.totalCost).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items Table */}

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2 text-left">Product</th>

                        <th className="py-2 text-center">Size</th>

                        <th className="py-2 text-center">Color</th>

                        <th className="py-2 text-center">Qty</th>

                        <th className="py-2 text-right">Cost</th>

                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {purchase.items?.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-700/30"
                        >
                          <td className="py-2">{item.productName}</td>

                          <td className="text-center">{item.size}</td>

                          <td className="text-center">{item.color}</td>

                          <td className="text-center">{item.qty}</td>

                          <td className="text-right">
                            ৳{Number(item.costPrice).toLocaleString()}
                          </td>

                          <td className="text-right text-amber-400">
                            ৳{Number(item.lineTotal).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
