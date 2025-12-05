import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const loggedIn = localStorage.getItem("admin_logged_in");

  if (!loggedIn) return <Navigate to="/admin" replace />;

  return children;
}
