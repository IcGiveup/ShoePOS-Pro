import { useState } from "react";
import axios from "axios";

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const token = localStorage.getItem("token");

  const submit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/customers",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Customer Added");
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Name"
        onChange={(e)=>
          setForm({
            ...form,
            name:e.target.value
          })
        }
      />

      <input
        placeholder="Phone"
        onChange={(e)=>
          setForm({
            ...form,
            phone:e.target.value
          })
        }
      />

      <input
        placeholder="Email"
        onChange={(e)=>
          setForm({
            ...form,
            email:e.target.value
          })
        }
      />

      <button>Add Customer</button>
    </form>
  );
}