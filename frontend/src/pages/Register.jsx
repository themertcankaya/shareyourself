import { useState } from "react";
import api from "../lib/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/register", formData);
      alert(res.data.msg);
    } catch (error) {
      alert(error.response?.data?.msg || "Bir hata oluştu");
    }
  };

  return (
    <div>
      <h1>Kayıt ol</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Adınız"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          onChange={handleChange}
        />
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;
