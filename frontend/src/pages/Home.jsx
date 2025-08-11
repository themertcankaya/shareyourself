import { useEffect, useState } from "react";
import api from "../lib/api";
const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await api.get("/api/posts");
      setPosts(res.data.posts);
    })();
  }, []);
  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2>Gönderiler</h2>
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
          <small>
            {p.author?.name} • {new Date(p.createdAt).toLocaleString()}
          </small>
        </article>
      ))}
    </div>
  );
};
export default Home;
