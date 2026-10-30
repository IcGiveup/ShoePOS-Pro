const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/pos", require("./routes/posRoutes"));
app.use("/api/returns", require("./routes/returnRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/purchases", require("./routes/purchaseRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});