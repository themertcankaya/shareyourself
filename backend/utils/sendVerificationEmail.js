const sgMail = require("@sendgrid/mail");

//API anahatarı ayarla

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * E-posta gönderme fonksiyonu
 * @param {string} name - Kullanıcının adı
 * @param {string} email - Alıcının e-posta adresi
 * @param {string} token - Doğrulama için oluşturulan token
 * @param {string} origin - Frontend domain (kullanıcı buraya yönlendirilir)
 */

const sendVerificationEmail = async (name, email, token, origin) => {
  //Doğrulama linki hazırla
  const verifyEmailURL = `${origin}/api/auth/verify-email?token=${token}&email=${email}`;

  // HTML içerik
  const message = `
          <h2>Merhaba, ${name} </h2>
    <p>Email adresinizi dogrulamak ic asagidaki baglantiya tiklayin:</p>
    <a href="${verifyEmailURL}">Emailimi Doğrula</a>
    `;

  // Maili gönder
  return sgMail.send({
    to: email,
    from: {
      name: "Admin - Mertcan KAYA",
      email: process.env.EMAIL_FROM,
    },
    subject: "Email Doğrulama",
    html: message,
  });
};

module.exports = sendVerificationEmail;
