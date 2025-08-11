// Gerekli modülleri ve modelleri içe aktar
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const { StatusCodes } = require("http-status-codes");

// JWT üretici yardımcı fonksiyon
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token 1 gün geçerli olacak
  });
};

// ✅ Kullanıcı kayıt işlemi
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // 1- Tüm alanlar dolu mu kontrol et
  if (!name || !email || !password) {
    throw new BadRequestError("Lütfen tüm alanları doldurun");
  }

  // 2- Bu email ile daha önce kayıt yapılmış mı?
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new BadRequestError("Bu email ile zaten kayıt olunmuş");

  // 3- Email doğrulama için JWT token üret
  const verificationToken = createToken({ email });

  // 4- Yeni kullanıcıyı oluştur (şifre hashleniyor pre-save içinde)
  const user = await User.create({ name, email, password });

  // 5- Doğrulama linkini içeren e-postayı gönder
  const origin = `http://localhost:5173`; // Vite frontend için
  // await sendVerificationEmail(name, email, verificationToken, origin);

  // 6- Yanıt dön
  res.status(StatusCodes.CREATED).json({
    msg: "Kayıt başarılı, e-posta gönderildi",
    user: {
      msg: "Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.",
    },
  });
};

// ✅ E-posta doğrulama işlemi
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  // Token yoksa hata fırlat
  if (!token) {
    throw new BadRequestError("Doğrulama token'ı eksik");
  }

  try {
    // JWT'yi çözümle (email payload'ını al)
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Email’e göre kullanıcıyı bul
    const user = await User.findOne({ email: payload.email });

    // Kullanıcı bulunamazsa
    if (!user) {
      throw new UnauthenticatedError("Geçersiz token: kullanıcı bulunamadı");
    }

    // Kullanıcı zaten doğrulanmışsa
    if (user.isVerified) {
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Hesap zaten doğrulanmış" });
    }

    // Doğrulama işlemini tamamla
    user.isVerified = true;
    await user.save();

    // Başarılı yanıt dön
    res.status(StatusCodes.OK).json({ msg: "E-posta doğrulama başarılı" });
  } catch (error) {
    // Token süresi dolmuşsa veya bozuksa
    throw new UnauthenticatedError("Token geçersiz veya süresi dolmuş.");
  }
};

// ✅ Login işlemi
const login = async (req, res) => {
  const { email, password } = req.body;
  if (req.cookies.token) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Zaten giriş yapılmış" });
  }
  // Email ve şifre alanı dolu mu?
  if (!email || !password) {
    throw new BadRequestError("Lütfen tüm alanları doldurun.");
  }

  // Kullanıcıyı email ile bul
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Geçersiz kullanıcı bilgisi");
  }

  // Şifre eşleşiyor mu kontrol et
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthenticatedError("Şifre hatalı");
  }

  // Kullanıcının email’i doğrulanmış mı?
  // if (!user.isVerified) {
  //   throw new UnauthenticatedError("Lütfen önce e-postanızı doğrulayın.");
  // }

  // Giriş başarılı → token üret
  const token = createToken({ userId: user._id });

  // Token’ı cookie olarak gönder
  res.cookie("token", token, {
    httpOnly: true, // JS erişemez (XSS koruması)
    secure: true, // sadece HTTPS
    sameSite: "none", // cross-site için gerekli
    maxAge: 24 * 60 * 60 * 1000, // 1 gün
  });

  // Yanıt olarak kullanıcı bilgilerini gönder
  res.status(StatusCodes.OK).json({
    msg: "Giriş başarılı",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// ✅ Çıkış işlemi
const logout = async (req, res) => {
  // Cookie’yi geçersiz hale getir (token = "logout" ve expires = şimdi)
  res.cookie("token", "logout", {
    httpOnly: true,
    secure: true, // sadece HTTPS
    sameSite: "none", // cross-site logout çalışsın
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "Çıkış yapıldı." });
};

// ✅ Oturum açmış kullanıcıyı getir
const getCurrentUser = async (req, res) => {
  // Middleware’de token doğrulandıysa req.user içine yazılmıştır
  const { user } = req;

  // Kullanıcıyı veritabanından bul
  const currentUser = await User.findById(user.userId);

  res.status(StatusCodes.OK).json({
    user: {
      id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
    },
  });
};

// Export işlemleri
module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  getCurrentUser,
};
