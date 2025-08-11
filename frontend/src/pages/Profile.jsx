import { useEffect, useState } from "react"; // React Hook'larını alıyoruz
import axios from "axios"; // HTTP istekleri için axios kullanıyoruz

const Profile = () => {
  // Kullanıcının adı, emaili ve profil fotoğrafı bilgileri state'te tutulacak
  const [user, setUser] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  // Kullanıcının seçtiği yeni profil fotoğrafı (file input ile gelecek)
  const [file, setFile] = useState(null);

  // ✅ 1. Kullanıcı bilgilerini backend'den al
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        withCredentials: true, // 🍪 Cookie'deki token backend'e gitsin
      });
      const { name, email, profileImage } = res.data.user; // cevaptan bilgileri al
      setUser({ name, email, profileImage }); // state'i güncelle
    } catch (err) {
      console.log("Kullanıcı alınamadı ❌", err);
    }
  };

  // ✅ 2. Sayfa ilk açıldığında kullanıcı verilerini al
  useEffect(() => {
    fetchUser(); // sadece 1 kez çalışsın diye dependency array boş
  }, []);

  // ✅ 3. Kullanıcı inputlara bir şey yazdığında state'i güncelle
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ 4. Kullanıcı bir fotoğraf seçtiğinde file state'ini güncelle
  const handleImage = (e) => {
    setFile(e.target.files[0]); // tek bir dosya alındığı için [0]
  };

  // ✅ 5. Form gönderildiğinde (submit) çalışacak ana fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // sayfa yenilenmesini engelle

    try {
      // 🔸 A. Ad ve e-posta güncelle
      await axios.patch(
        "http://localhost:5000/api/user/update-user",
        {
          name: user.name,
          email: user.email,
        },
        {
          withCredentials: true, // token yine cookie'den gönderiliyor
        }
      );

      // 🔸 B. Eğer bir dosya seçildiyse onu da ayrı olarak yükle
      if (file) {
        const formData = new FormData(); // form-data yapısı
        formData.append("image", file); // 👈 upload.js'teki name="image" olmalı

        await axios.post("http://localhost:5000/api/upload/image", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // FormData için gerekli
          },
        });
      }

      alert("Güncelleme başarılı ✅"); // kullanıcıya bilgilendirme

      fetchUser(); // güncel bilgileri tekrar al ve ekrana yansıt
    } catch (err) {
      console.log("Güncelleme hatası ❌", err);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>👤 Profil</h2>

      {/* Güncelleme Formu */}
      <form onSubmit={handleSubmit}>
        {/* İsim inputu */}
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Adınız"
        />

        {/* E-posta inputu */}
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />

        {/* Profil resmi dosya yükleme */}
        <input type="file" onChange={handleImage} />

        <button type="submit">Güncelle</button>
      </form>

      <br />

      {/* Eğer profil resmi varsa onu göster */}
      {user.profileImage && (
        <img
          src={user.profileImage}
          alt="profil"
          style={{ width: "150px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
};

export default Profile;
