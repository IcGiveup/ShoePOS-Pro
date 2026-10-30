import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [editingProduct, setEditingProduct] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    brand: "",
    category: "",
    basePrice: "",
    variants: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (product) => {
    setEditingProduct(product);

    setEditForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: product.basePrice,
      variants: product.variants || [],
    });
  };

  // UPDATE VARIANT STOCK
  const updateVariantStock = (index, value) => {
    // BLOCK NEGATIVE STOCK
    if (Number(value) < 0 && value !== "") {
      return;
    }

    const updatedVariants = [...editForm.variants];

    updatedVariants[index].stock = value;

    setEditForm({
      ...editForm,
      variants: updatedVariants,
    });
  };

  // UPDATE PRODUCT
  const updateProduct = async () => {
    try {
      // VALIDATE PRICE
      if (Number(editForm.basePrice) < 0) {
        alert("Price cannot be negative");
        return;
      }

      // VALIDATE STOCKS
      const invalidStock = editForm.variants.some(
        (v) => Number(v.stock) < 0
      );

      if (invalidStock) {
        alert("Stock cannot be negative");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        {
          name: editForm.name,
          brand: editForm.brand,
          category: editForm.category,
          basePrice: Number(editForm.basePrice),
          variants: editForm.variants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product updated successfully");

      setEditingProduct(null);

      fetchProducts();
    } catch (err) {
      console.log(err);

      alert("Failed to update product");
    }
  };

  // FILTER
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" ? true : p.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Products
            </h1>

            <p className="text-slate-400 mt-1">
              Manage inventory products
            </p>
          </div>

          <button
            onClick={() => navigate("/add-product")}
            className="bg-amber-400 hover:bg-amber-300 text-black px-5 py-3 rounded-xl font-semibold transition"
          >
            + Add Product
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
            >
              <option>All</option>
              <option>Sports</option>
              <option>Casual</option>
              <option>Running</option>
              <option>Sneakers</option>
            </select>

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-auto">
          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="py-4">Product</th>
                <th className="py-4">Brand</th>
                <th className="py-4">Price</th>
                <th className="py-4">Stock</th>
                <th className="py-4">Category</th>
                <th className="py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                >
                  <td className="py-4 text-white font-medium">
                    {product.name}
                  </td>

                  <td className="py-4 text-slate-300">
                    {product.brand}
                  </td>

                  <td className="py-4 text-amber-400 font-semibold">
                    ৳
                    {Number(product.basePrice || 0).toLocaleString(
                      "en-US"
                    )}
                  </td>

                  {/* STOCK */}
                  <td className="py-4">
                    <div className="relative group inline-block">

                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold cursor-pointer">
                        {Number(product.stock || 0).toLocaleString(
                          "en-US"
                        )}{" "}
                        Pairs
                      </span>

                      {/* TOOLTIP */}
                      <div className="absolute left-0 top-12 hidden group-hover:block z-50 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4">

                        <p className="text-white font-semibold mb-3">
                          Available Variants
                        </p>

                        <div className="space-y-2">
                          {product.variants &&
                          product.variants.length > 0 ? (
                            product.variants.map((variant, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center border-b border-slate-800 pb-2 text-sm"
                              >
                                <span className="text-slate-300">
                                  Size {variant.size} •{" "}
                                  {variant.color}
                                </span>

                                <span className="text-emerald-400 font-semibold">
                                  {variant.stock} pcs
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-400 text-sm">
                              No variant details available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 text-slate-300">
                    {product.category}
                  </td>

                  <td className="py-4">
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => openEditModal(product)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-slate-400"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* EDIT MODAL */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 overflow-auto p-5">

            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-2xl">

              <h2 className="text-3xl font-bold text-white mb-6">
                Smart Stock Management
              </h2>

              {/* PRODUCT INFO */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">

                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />

                <input
                  type="text"
                  value={editForm.brand}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      brand: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />

                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />

                {/* PRICE */}
                <input
                  type="number"
                  min="0"
                  value={editForm.basePrice}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (Number(value) >= 0 || value === "") {
                      setEditForm({
                        ...editForm,
                        basePrice: value,
                      });
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
              </div>

              {/* VARIANTS */}
              <div>

                <h3 className="text-white text-xl font-semibold mb-4">
                  Product Variants
                </h3>

                <div className="space-y-4 max-h-[400px] overflow-auto pr-2">

                  {editForm.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 border border-slate-700 rounded-2xl p-4"
                    >
                      <div className="grid grid-cols-3 gap-4 items-center">

                        {/* SIZE */}
                        <div>
                          <p className="text-slate-400 text-sm mb-1">
                            Size
                          </p>

                          <div className="bg-slate-900 rounded-xl px-4 py-3 text-white">
                            {variant.size}
                          </div>
                        </div>

                        {/* COLOR */}
                        <div>
                          <p className="text-slate-400 text-sm mb-1">
                            Color
                          </p>

                          <div className="bg-slate-900 rounded-xl px-4 py-3 text-white">
                            {variant.color}
                          </div>
                        </div>

                        {/* STOCK */}
                        <div>
                          <p className="text-slate-400 text-sm mb-1">
                            Stock
                          </p>

                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariantStock(
                                index,
                                e.target.value
                              )
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                          />
                        </div>

                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-8">

                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-5 py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={updateProduct}
                  className="bg-amber-400 hover:bg-amber-300 text-black px-6 py-3 rounded-xl font-semibold"
                >
                  Save Changes
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}