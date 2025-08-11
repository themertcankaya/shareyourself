import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", formData);
      alert(res.data.msg);

      // ⚠️ dispatch'i await ile yapıyoruz
      const result = await dispatch(getCurrentUser());

      // Eğer kullanıcı alınamazsa login'e yönlendir
      if (getCurrentUser.fulfilled.match(result)) {
        navigate("/profile");
      } else {
        alert("Kullanıcı alınamadı");
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Bir hata oluştu.");
    }
  };
  return (
    <div>
      <h1>Giriş Yap</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off" // ✨ otomatik doldurmayı engeller
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password" // ✨ bazı tarayıcılarda daha etkili
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
