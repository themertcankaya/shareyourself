import { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onFile = (e) => setFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    if (file) fd.append("image", file);

    try {
      await axios.post("http://localhost:5000/api/posts", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Gönderi oluşturuldu");
      setForm({ title: "", content: "" });
    } catch (error) {
      alert(err.response?.data?.msg || "Hata oluştu");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Yeni Paylaşım</h2>
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
        <button type="submit">Paylaş</button>
      </form>
    </div>
  );
};
export default CreatePost;
