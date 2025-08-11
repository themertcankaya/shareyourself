const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  // 1. Token var mı?
  if (!token) {
    throw new UnauthenticatedError("Kimlik doğrulama başarısız - token yok");
  }

  try {
    // 2. Token'ı çözümle
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Kullanıcıyı req.user içine yerleştir
    req.user = { userId: payload.userId };

    next(); // bir sonraki middleware'e/geçerli route'a geç
  } catch (error) {
    throw new UnauthenticatedError("Token geçersiz veya süresi dolmuş");
  }
};

module.exports = authMiddleware;
