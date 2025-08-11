import { useEffect } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logoutUserFunc = async () => {
      try {
        // ✅ Logout isteği at → Cookie'deki token geçersiz kılınacak
        await api.get("/api/auth/logout");

        dispatch(logoutUser()); //🔥 store'dan kullanıcıyı sil
        navigate("/login"); // login sayfasına yönlendir
      } catch (error) {
        console.log("Çıkış başarısız", error);
      }
    };
    logoutUserFunc();
  }, [navigate, dispatch]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>👋 Çıkış yapılıyor...</h2>
      <p>Lütfen bekleyin...</p>
    </div>
  );
};

export default Logout;
