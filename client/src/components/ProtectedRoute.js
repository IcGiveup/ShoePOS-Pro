import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  roles = [],
}) {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/" />;
  }

  // Role restriction
  if (
    roles.length > 0 &&
    !roles.includes(user.role)
  ) {
    if (user.role === "cashier") {
      return <Navigate to="/pos" />;
    }

    return <Navigate to="/dashboard" />;
  }

  return children;
}