import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Users() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/users",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User created");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "cashier",
      });

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.msg ||
          "Failed"
      );
    }
  };

  const deleteUser = async (id) => {
    if (
      !window.confirm(
        "Delete this user?"
      )
    )
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold text-white">
            User Management
          </h1>

          <p className="text-slate-400">
            Manage Cashiers
          </p>
        </div>

        {/* ADD USER */}

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

          <form
            onSubmit={createUser}
            className="grid md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="bg-slate-800 rounded-xl px-4 py-3 text-white"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="bg-slate-800 rounded-xl px-4 py-3 text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="bg-slate-800 rounded-xl px-4 py-3 text-white"
            />

            <button
              type="submit"
              className="bg-amber-400 text-black rounded-xl font-bold"
            >
              Add Cashier
            </button>
          </form>
        </div>

        {/* USERS TABLE */}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-4 text-left">
                  Name
                </th>

                <th className="py-4 text-left">
                  Email
                </th>

                <th className="py-4 text-left">
                  Role
                </th>

                <th className="py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-slate-800"
                >
                  <td className="py-4">
                    {user.name}
                  </td>

                  <td className="py-4">
                    {user.email}
                  </td>

                  <td className="py-4 uppercase">
                    {user.role}
                  </td>

                  <td className="py-4 text-right">
                    {user.role !==
                      "admin" && (
                      <button
                        onClick={() =>
                          deleteUser(
                            user._id
                          )
                        }
                        className="bg-red-600 px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    )}
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