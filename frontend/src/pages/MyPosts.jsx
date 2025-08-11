// pages/MyPosts.jsx
import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMine = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/posts/me");
      setPosts(res.data.posts);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bu gönderiyi silmek istiyor musun?")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      // listeyi tazele
      fetchMine();
      // Home sayfasına dönersen orası mount olduğunda tekrar fetch edecek
    } catch (e) {
      alert(e.response?.data?.msg || "Silme hatası");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2>Benim Paylaşımlarım</h2>
      {posts.length === 0 && <p>Henüz paylaşımın yok.</p>}
      {posts.map((p) => (
        <article
          key={p._id}
          style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12 }}
        >
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          {p.image && (
            <img
              src={p.image}
              alt=""
              style={{ width: "100%", maxHeight: 320, objectFit: "cover" }}
            />
          )}
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <Link to={`/edit/${p._id}`}>Düzenle</Link>
            <button onClick={() => handleDelete(p._id)}>Sil</button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default MyPosts;
