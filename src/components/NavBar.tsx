import { useNavigate } from "react-router-dom";

interface NavBarProps {
  onNavClick: (id: string) => void;
}
const styles = {
  navbar: {
    width: "100%",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "center",
    borderBottom: "1px solid #eee",
    background: "#ffffff",
    position: "sticky" as const,
    top: 0,
    zIndex: 1000
  },

  navbarInner: {
    width: "100%",
    maxWidth: "1250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },

  brandMark: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  brandLogo: {
    height: "98px",
    width: "auto"
  },

  tagline: {
    fontSize: "14px",
    color: "#5a6b5f",
    marginLeft: "6px",
    marginTop: "4px"
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "28px"
  },

  linkBtn: {
    background: "none",
    border: "none",
    fontSize: "15px",
    cursor: "pointer"
  },

  bookBtn: {
    background: "#0b8a5f",
    color: "white",
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  }
};

export const NavBar = ({ onNavClick }: NavBarProps) => {
  const navigate = useNavigate();

return (
  <header style={styles.navbar}>
    <div style={styles.navbarInner}>
      
      {/* Logo + Tagline */}
      <div style={styles.brandMark}>
        <img
          src="/logo.png"
          alt="Aropranish Logo"
          style={styles.brandLogo}
        />

        <span style={styles.tagline}>
          Plant-Based Relief, 
          Doctor-Led Care
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={styles.navLinks}>
        <button style={styles.linkBtn} onClick={() => onNavClick("how-it-works")}>How It Works</button>
        <button style={styles.linkBtn} onClick={() => onNavClick("who-we-help")}>Who We Help</button>
        <button style={styles.linkBtn} onClick={() => onNavClick("pricing")}>Pricing</button>
        <button style={styles.linkBtn} onClick={() => onNavClick("about-doctor")}>About Dr. Nayak</button>
        <button style={styles.linkBtn} onClick={() => onNavClick("faq")}>FAQs</button>

        <button
          style={styles.bookBtn}
          onClick={() => navigate("/booking")}
        >
          Book Consultation
        </button>
      </nav>

    </div>
  </header>
);

};
