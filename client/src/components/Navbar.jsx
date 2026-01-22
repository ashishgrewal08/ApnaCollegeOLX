import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="nav-logo-text" style={{ textDecoration: "none", color: "inherit" }}>
          ApnaCollegeOLX
        </Link>
        <span className="nav-logo-badge">Campus pre-loved marketplace</span>
      </div>

      <div className="nav-links">
        <Link className="nav-link" to="/" style={{textDecoration:"none"}}>
          Explore
        </Link>
        {user && (
          <Link className="nav-link" to="/my" style={{textDecoration:"none"}}>
            My Listings
          </Link>
        )}
        {user && (
          <Link className="nav-link nav-pill-primary" to="/add" style={{textDecoration:"none"}}>
            + Sell item
          </Link>
        )}

        {!user && (
          <>
            <Link className="nav-link" to="/login" style={{textDecoration:"none"}}>
              Log in
            </Link>
            <Link className="nav-link nav-pill-primary" to="/register" style={{textDecoration:"none"}}>
              Sign up
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="nav-user-badge">Hi, {user.name}</span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {user && (
  <Link className="nav-link" to="/cart" style={{textDecoration:"none"}}>
    Cart
  </Link>
)}

      </div>
    </nav>
  );
}

