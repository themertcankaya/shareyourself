const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Başlık zorunludur"],
      trim: true,
      maxlength: 140,
    },
    content: {
      type: String,
      required: [true, "İçerik zorunludur"],
      trim: true,
      maxlength: 5000,
    },
    image: {
      type: String, //Cloudinary URL
      default: "",
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", PostSchema);
