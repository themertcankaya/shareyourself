const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "İsim gereklidir"],
    trim: true,
  },
  comment: {
    type: String,
    required: [true, "Yorum boş olamaz"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
