// pages/EditPost.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onFile = (e) => setFile(e.target.files[0]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        const p = res.data.post;
        setForm({ title: p.title, content: p.content });
      } catch (e) {
        alert("Post bulunamadı.");
        navigate("/my-posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      if (file) fd.append("image", file);

      await axios.patch(`http://localhost:5000/api/posts/${id}`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Güncellendi");
      // kendi liste sayfana dön
      navigate("/my-posts");
    } catch (e) {
      alert(e.response?.data?.msg || "Güncelleme hatası");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Gönderiyi Düzenle</h2>
      <form onSubmit={onSubmit}>
        <input
          name="title"
          placeholder="Başlık"
          value={form.title}
          onChange={onChange}
        />
        <textarea
          name="content"
          placeholder="İçerik"
          value={form.content}
          onChange={onChange}
        />
        <input type="file" onChange={onFile} />
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default EditPost;
