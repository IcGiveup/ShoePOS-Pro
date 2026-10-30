import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    basePrice: "",
    stock: "",
    description: "",
    sizes: "",
    colors: "",
  });

  const [loading, setLoading] = useState(false);

  // NORMAL INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // VALIDATE STOCK
      if (Number(form.stock) < 0) {
        alert("Stock cannot be negative");
        return;
      }

      // SPLIT SIZES
      const sizesArray = form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // SPLIT COLORS
      const colorsArray = form.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      // VALIDATION
      if (sizesArray.length === 0 || colorsArray.length === 0) {
        alert("Please enter sizes and colors");
        return;
      }

      // TOTAL VARIANTS
      const totalVariants = sizesArray.length * colorsArray.length;

      // STOCK PER VARIANT
      const stockPerVariant = Math.max(
        1,
        Math.floor(Number(form.stock) / totalVariants),
      );

      // CREATE VARIANTS
      const variants = [];

      sizesArray.forEach((size) => {
        colorsArray.forEach((color) => {
          variants.push({
            size,
            color,
            stock: stockPerVariant,
            price: Number(form.basePrice),
            barcode:
              "BAR-" +
              Date.now() +
              Math.floor(Math.random() * 1000),
          });
        });
      });

      // FINAL PAYLOAD
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        basePrice: Number(form.basePrice),
        description: form.description,
        variants,
      };

      console.log("PAYLOAD => ", payload);

      await axios.post(
        "http://localhost:5000/api/products",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Product Added Successfully");

      navigate("/products");
    } catch (err) {
      console.log(err.response?.data || err.message);

      alert(err.response?.data?.msg || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white">
            Add Product
          </h1>

          <p className="text-slate-400 mt-2 text-lg">
            Create a new product with variants and stock
          </p>
        </div>

        {/* FORM */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={submit} className="space-y-6">
            {/* GRID */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* PRODUCT NAME */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Nike Air Max"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* BRAND */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  placeholder="Nike"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  placeholder="Sneakers"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* BASE PRICE */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Base Price
                </label>

                <input
                  type="number"
                  min="0"
                  name="basePrice"
                  placeholder="4500"
                  value={form.basePrice}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Total Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  name="stock"
                  placeholder="50"
                  value={form.stock}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (Number(value) >= 0 || value === "") {
                      setForm({
                        ...form,
                        stock: value,
                      });
                    }
                  }}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* SIZES */}
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Sizes
                </label>

                <input
                  type="text"
                  name="sizes"
                  placeholder="39,40,41,42"
                  value={form.sizes}
                  onChange={(e) => {
                    const value = e.target.value;

                    // ONLY NUMBERS + COMMA
                    const valid = /^[0-9,]*$/;

                    if (valid.test(value)) {
                      setForm({
                        ...form,
                        sizes: value,
                      });
                    }
                  }}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* COLORS */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                Colors
              </label>

              <input
                type="text"
                name="colors"
                placeholder="Black,White,Red"
                value={form.colors}
                onChange={(e) => {
                  const value = e.target.value;

                  // ONLY LETTERS + COMMA
                  const valid = /^[a-zA-Z,\s]*$/;

                  if (valid.test(value)) {
                    setForm({
                      ...form,
                      colors: value,
                    });
                  }
                }}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                Description
              </label>

              <textarea
                rows="5"
                name="description"
                placeholder="Product description..."
                value={form.description}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-8 py-3 rounded-2xl bg-slate-600 hover:bg-slate-500 text-white font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}