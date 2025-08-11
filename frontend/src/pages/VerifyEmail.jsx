import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}&email=${email}`
        );
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    if (token && email) {
      verifyEmail();
    } else {
      setStatus("invalid");
    }
  }, [token, email]);
  if (status === "loading") return <p>Doğrulama yapılıyor...</p>;
  if (status === "success") return <h2>✅ E-posta doğrulandı!</h2>;
  if (status === "error") return <h2>❌ Doğrulama başarısız.</h2>;
  if (status === "invalid") return <h2>❌ Geçersiz bağlantı.</h2>;

  return null;
};

export default VerifyEmail;
