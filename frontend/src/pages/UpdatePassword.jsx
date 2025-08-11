import { useState } from "react";
import api from "../lib/api";

const UpdatePassword = () => {
  // Şifre alanlarını tutan state
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  //Form elemanlarında değişiklik olunca state güncellenir
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit edildiğinde backend'e gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch("/api/user/update-password", formData);
      alert(res.data.msg); // Başarılı mesaj
      // Formu temizle
      setFormData({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.msg || "Şifre güncellenirken bir hata oluştu."
      );
    }
  };
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>🔒 Şifre Güncelle</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Eski şifre"
          value={formData.oldPassword}
          onChange={handleChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Yeni şifre"
          value={formData.newPassword}
          onChange={handleChange}
        />
        <button type="submit">Güncelle</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
