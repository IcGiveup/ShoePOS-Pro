import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function DeadStock() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");

  const load = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reports/dead-stock",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1>Dead Stock</h1>

      {items.map((item) => (
        <div key={item._id}>
          {item.productId?.name} | Size: {item.size} | Color: {item.color} |
          Stock: {item.stock}
        </div>
      ))}
    </div>
  );
}