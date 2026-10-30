import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import Layout from "../components/Layout";

export default function Customers() {
  const token =
    localStorage.getItem("token");

  const [customers, setCustomers] =
    useState([]);

  const [
    editingCustomer,
    setEditingCustomer,
  ] = useState(null);

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      email: "",
      points: 0,
    });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers =
    async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/customers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCustomers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

  const deleteCustomer =
    async (id) => {
      if (
        !window.confirm(
          "Delete this customer?"
        )
      )
        return;

      try {
        await axios.delete(
          `http://localhost:5000/api/customers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchCustomers();
      } catch (err) {
        console.log(err);
      }
    };

  const openEditModal = (
    customer
  ) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      points: customer.points,
    });
  };

  const updateCustomer =
    async () => {
      // NAME VALIDATION
      if (
        !/^[A-Za-z\s]+$/.test(
          form.name
        )
      ) {
        return alert(
          "Name must contain only letters"
        );
      }

      // PHONE VALIDATION
      if (
        !/^[0-9]{11}$/.test(
          form.phone
        )
      ) {
        return alert(
          "Phone number must be exactly 11 digits"
        );
      }

      // EMAIL VALIDATION
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email
        )
      ) {
        return alert(
          "Enter valid email"
        );
      }

      try {
        await axios.put(
          `http://localhost:5000/api/customers/${editingCustomer._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEditingCustomer(null);

        fetchCustomers();
      } catch (err) {
        console.log(err);

        alert(
          "Failed to update customer"
        );
      }
    };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white">
            Customers
          </h1>

          <p className="text-slate-400 mt-1">
            Manage customer database
          </p>
        </div>

        {/* Customer List */}
        <div className="space-y-5">
          {customers.map(
            (customer) => (
              <div
                key={customer._id}
                className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex justify-between items-start"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {customer.name}
                  </h2>

                  <p className="text-slate-300 mt-2">
                    Phone:{" "}
                    {
                      customer.phone
                    }
                  </p>

                  <p className="text-slate-300">
                    Email:{" "}
                    {
                      customer.email
                    }
                  </p>

                  <p className="text-amber-400 font-bold mt-3">
                    Points:{" "}
                    {
                      customer.points
                    }
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      openEditModal(
                        customer
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-3 rounded-xl"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteCustomer(
                        customer._id
                      )
                    }
                    className="bg-red-500 hover:bg-red-400 text-white px-5 py-3 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Edit Modal */}
        {editingCustomer && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-3xl font-bold text-white mb-6">
                Edit Customer
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target
                          .value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />

                <input
                  type="tel"
                  maxLength="11"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone:
                        e.target
                          .value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target
                          .value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />

                <input
                  type="number"
                  placeholder="Points"
                  value={form.points}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      points:
                        e.target
                          .value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() =>
                    setEditingCustomer(
                      null
                    )
                  }
                  className="bg-slate-600 hover:bg-slate-500 text-white px-5 py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    updateCustomer
                  }
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