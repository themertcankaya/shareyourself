// routes/upload.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");

router.post("/image", authMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ msg: "Dosya yüklenmedi" });
    }

    const file = req.files.image;

    // Sadece görsel kabul et
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json({ msg: "Yalnızca resim dosyası yüklenebilir." });
    }

    // express-fileupload + useTempFiles:true sayesinde gerçek geçici dosya yolu
    // server.js'te tempFileDir'i prod: /tmp, local: backend/tmp olarak ayarlamıştık
    const tempPath = file.tempFilePath;
    if (!tempPath) {
      return res.status(500).json({ msg: "Geçici dosya yolu bulunamadı." });
    }

    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "profile-images",
      resource_type: "image",
    });

    // Geçici dosyayı temizle (best-effort)
    fs.unlink(tempPath, () => {});

    // Kullanıcıyı güncelle
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: "Kullanıcı bulunamadı" });

    user.profileImage = result.secure_url;
    await user.save();

    return res.status(201).json({
      msg: "Yükleme başarılı",
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res
      .status(500)
      .json({ msg: "Yükleme hatası", error: error.message });
  }
});

module.exports = router;
