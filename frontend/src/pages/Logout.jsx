import { useEffect } from "react";
import axios from "axios";
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
        await axios.get("http://localhost:5000/api/auth/logout", {
          withCredentials: true, //Cookie'yi gönder
        });

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
