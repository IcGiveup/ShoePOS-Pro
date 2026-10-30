import { useState } from "react";
import axios from "axios";

export default function GRN() {
  const [supplierId, setSupplierId] =
    useState("");

  const [items, setItems] = useState([
    {
      variantId: "",
      productName: "",
      size: "",
      color: "",
      qty: 1,
      costPrice: 0
    }
  ]);

  const token = localStorage.getItem("token");

  const submit = async () => {
    await axios.post(
      "http://localhost:5000/api/purchases",
      { supplierId, items },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("GRN Saved");
  };

  return (
    <div>
      <h1>GRN Entry</h1>

      <input
        placeholder="Supplier ID"
        onChange={(e)=>
          setSupplierId(e.target.value)
        }
      />

      <button onClick={submit}>
        Save GRN
      </button>
    </div>
  );
}