const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");

router.post("/image", authMiddleware, async (req, res) => {
  console.log("req.user:", req.user);
  if (!req.files || !req.files.image) {
    return res.status(400).json({ msg: "Dosya yüklenmedi" });
  }

  const file = req.files.image;
  console.log("req.files", req.files);
  // Dosya geçerli mi?
  if (!file.mimetype.startsWith("image")) {
    return res
      .status(400)
      .json({ msg: "Yalnızca resim dosyası yüklenebilir." });
  }

  // Dosyayı geçici klasöre taşı
  const uploadPath = path.join(__dirname, "../tmp", file.name);
  await file.mv(uploadPath); // dosyayı tmp klasörüne taşı

  try {
    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(uploadPath, {
      folder: "profile-images",
    });

    // Yükledikten sonra dosyayı sil
    fs.unlinkSync(uploadPath);

    // Kullanıcıyı veritabanında bul
    const user = await User.findById(req.user.userId);

    // Cloudinary URL'yi profileImage olarak kaydet
    user.profileImage = result.secure_url;

    await user.save();

    res.status(201).json({
      msg: "Yükleme başarılı",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ msg: "Yükleme hatası", error: error.message });
  }
});

module.exports = router;
