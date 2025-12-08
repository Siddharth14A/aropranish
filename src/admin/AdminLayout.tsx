import { Link } from "react-router-dom";

export default function AdminLayout({ children }: any) {
  function logout() {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/admin";
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: 250,
        background: "#1d2e28",
        color: "white",
        padding: 20
      }}>
        <h2>Aropranish Admin</h2>

        <nav style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
          <Link to="/admin/dashboard" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/admin/appointments" style={{ color: "white" }}>Appointments</Link>
          <Link to="/admin/medical-certificates" style={{ color: "white" }}>
            Medical Certificates
          </Link>

          <Link to="/admin/off-days" style={{ color: "white" }}>Doctor Off Days</Link>
          <Link to="/admin/providers" style={{ color: "white" }}>Providers</Link>

          <button
            onClick={logout}
            style={{
              marginTop: 20,
              padding: "10px",
              background: "red",
              border: "none",
              color: "white",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 30, background: "#f4f7f2" }}>
        {children}
      </div>
    </div>
  );
}
