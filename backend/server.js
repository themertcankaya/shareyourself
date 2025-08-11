require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Core
const connectDB = require("./config/db");

// Güvenlik
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const sanitizeMiddleware = require("./middlewares/sanitize");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");
const postRoutes = require("./routes/post");

const errorHandlerMiddleware = require("./middlewares/errorHandler");

// File Upload
const fileUpload = require("express-fileupload");
// Dosya Yükleme (Cloudinary ile veya local temp klasör)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
  })
);
// DB Models (örnek: Comment için test route'larında)
const Comment = require("./models/Comment");

// ------------------ MIDDLEWARES ------------------

app.use(express.json()); // JSON body parse

app.use(helmet()); // Güvenli HTTP header'lar
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser()); // Cookie okuyabilmek için
app.use(sanitizeMiddleware); // XSS ve HTML temizleme
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Çok fazla istek gönderildi. Lütfen sonra tekrar deneyin.",
  })
);

// Test ve root endpoint’leri
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

app.post("/test", (req, res) => {
  res.status(200).json({ sanitizedBody: req.body });
});

// (Örnek) Yorum gönderimi
app.post("/api/comments", async (req, res) => {
  console.log("Gelen body:", req.body);
  try {
    const newComment = await Comment.create(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    if (error.message.includes("Comment validation failed")) {
      return res.status(400).json({
        error: "Yorum geçerli değil veya zararlı içerik barındırıyor",
      });
    }
    res.status(400).json({ error: error.message });
  }
});

// Ana Route'lar
app.use("/api/auth", authRoutes); // ✔️ Register, login, verify, logout, current-user
app.use("/api/user", userRoutes); // (Varsa özel kullanıcı işlemleri)
app.use("/api/upload", uploadRoutes); // Görsel dosya yükleme
app.use("/api/posts", postRoutes);
// Hata Yakalama Middleware
app.use(errorHandlerMiddleware);

// ------------------ SUNUCU BAŞLAT ------------------
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error("Sunucu başlatma hatası:", error);
  }
};

startServer();
