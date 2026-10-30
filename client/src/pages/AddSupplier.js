import { useState } from "react";
import axios from "axios";

export default function AddSupplier() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: ""
  });

  const token = localStorage.getItem("token");

  const submit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/suppliers",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Supplier Added");
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
        placeholder="Company"
        onChange={(e)=>
          setForm({
            ...form,
            company:e.target.value
          })
        }
      />

      <button>Add Supplier</button>
    </form>
  );
}