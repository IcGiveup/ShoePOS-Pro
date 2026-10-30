import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function TopSelling() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");

  const load = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reports/top-selling",
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
      <h1>Top Selling Shoes</h1>

      {items.map((item, i) => (
        <div key={i}>
          {item._id} | Sold: {item.qty} | Revenue: ৳{item.revenue}
        </div>
      ))}
    </div>
  );
}