// components/Navbar.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/create">Paylaş</Link>
          <Link to="/my-posts">Benim Postlarım</Link>
          <Link to="/profile">Profil</Link>
          <Link to="/logout">Çıkış</Link>
        </>
      ) : (
        <>
          <Link to="/login">Giriş</Link>
          <Link to="/register">Kayıt</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
