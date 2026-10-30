import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Returns from "./pages/Returns";
import Invoice from "./pages/Invoice";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import InventoryLogs from "./pages/InventoryLogs";
import Suppliers from "./pages/Suppliers";
import ProtectedRoute from "./components/ProtectedRoute";
import Purchases from "./pages/Purchases";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<Login />} />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Purchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Purchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory-logs"
          element={
            <ProtectedRoute roles={["admin"]}>
              <InventoryLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        {/* ================= POS ================= */}

        <Route
          path="/pos"
          element={
            <ProtectedRoute roles={["admin", "cashier"]}>
              <POS />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* ================= CUSTOMERS ================= */}

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* ================= RETURNS ================= */}

        <Route
          path="/returns"
          element={
            <ProtectedRoute>
              <Returns />
            </ProtectedRoute>
          }
        />

        {/* ================= INVOICE ================= */}

        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          }
        />

        {/* ================= PRODUCTS ================= */}

        <Route
          path="/products"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Products />
            </ProtectedRoute>
          }
        />

        {/* ================= ADD PRODUCT ================= */}

        <Route
          path="/add-product"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* ================= ANALYTICS ================= */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
