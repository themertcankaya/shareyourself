const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const getCurrentUser = async (req, res) => {
  const currentUser = await User.findById(req.user.userId); // authMiddleware'den geliyor
  if (!currentUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Kullanıcı bulunamadı" });
  }
  res.status(StatusCodes.OK).json({
    user: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      profileImage: currentUser.profileImage,
    },
  });
};

const updateUser = async (req, res) => {
  const { name, email, profileImage } = req.body;
  if (!name || !email) {
    throw new BadRequestError("İsim ve e-posta alanları zorunludur.");
  }
  //   console.log({ name, email });
  const user = await User.findByIdAndUpdate(
    req.user.userId, // authMiddleware'den geliyor
    { name, email, profileImage },
    { new: true, runValidators: true }
  );
  //   console.log(user);
  res.status(StatusCodes.OK).json({
    msg: "Kullanıcı bilgileri güncellendi.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // 1. Alanlar dolu mu?
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Eski ve yeni şifre gereklidir.");
  }

  // 2. Kullanıcıyı bul
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new UnauthenticatedError("Kullanıcı bulunamadı.");
  }

  // 3. Eski şifre doğru mu?
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new UnauthenticatedError("Eski şifre hatalı.");
  }

  // 4. Yeni şifreyi ata ve kaydet
  user.password = newPassword;
  await user.save(); // save içinde mongoose 'pre' middleware çalışır → hashlenir

  res.status(StatusCodes.OK).json({ msg: "Şifre başarıyla güncellendi." });
};
module.exports = { getCurrentUser, updateUser, updatePassword };
