const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lütfen adınızı girin"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email zorunludur"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Lütfen geçerli bir email girin",
      ],
    },
    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false, // ilk başta doğrulanmamış olarak kayıt edilecek.
    },
    // verificationToken: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

// Şifreyi kaydetmeden önce hash'le

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Giriş sırasında şifre karşılaştırmak için metot tanımlıyoruz

UserSchema.methods.comparePassword = async function (girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.password);
};

module.exports = mongoose.model("User", UserSchema);
