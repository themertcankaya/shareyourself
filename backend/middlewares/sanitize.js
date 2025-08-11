// middleware/sanitize.js

const sanitizeHtml = require("sanitize-html");

// Bu middleware, gelen verileri temizler
const sanitizeMiddleware = (req, res, next) => {
  // Sadece body içindeki veriler temizlenir
  if (req.body) {
    for (let key in req.body) {
      // Sadece string olan değerleri temizle
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key]); // HTML kodları çıkarılır
        if (req.body[key] === "") {
          req.body[key] = "[temizlendi]";
        }
      }
    }
  }
  next(); // Devam et
};

module.exports = sanitizeMiddleware;
